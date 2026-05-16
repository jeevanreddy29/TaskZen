from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import uuid
import os
from dotenv import load_dotenv

import models, schemas, auth
from database import engine, get_db
from ai.utils import summarize_text, extract_tasks

load_dotenv()

app = FastAPI(title="TaskZen API")

@app.on_event("startup")
def on_startup():
    # Create database tables on startup
    models.Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_or_create_user(db: Session, user_id: str):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        user = models.User(id=user_id, email=f"{user_id}@placeholder.com")
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

@app.get("/")
async def root():
    return {"message": "Welcome to TaskZen API", "status": "active"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

# --- Tasks ---

@app.get("/tasks", response_model=list[schemas.TaskResponse])
def get_tasks(db: Session = Depends(get_db), user_id: str = Depends(auth.get_current_user)):
    user = get_or_create_user(db, user_id)
    return db.query(models.Task).filter(models.Task.owner_id == user_id).order_by(models.Task.created_at.desc()).all()

@app.post("/tasks", response_model=schemas.TaskResponse)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db), user_id: str = Depends(auth.get_current_user)):
    user = get_or_create_user(db, user_id)
    db_task = models.Task(
        id=str(uuid.uuid4()),
        owner_id=user_id,
        title=task.title,
        priority=task.priority,
        status=task.status,
        due=task.due,
        subtasks=task.subtasks,
        ai_generated=task.ai_generated
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.patch("/tasks/{task_id}", response_model=schemas.TaskResponse)
def update_task(task_id: str, task: schemas.TaskUpdate, db: Session = Depends(get_db), user_id: str = Depends(auth.get_current_user)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.owner_id == user_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    update_data = task.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_task, key, value)
    
    db.commit()
    db.refresh(db_task)
    return db_task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: str, db: Session = Depends(get_db), user_id: str = Depends(auth.get_current_user)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.owner_id == user_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(db_task)
    db.commit()
    return {"status": "deleted"}

@app.post("/tasks/{task_id}/ai-subtasks", response_model=schemas.TaskResponse)
async def generate_ai_subtasks(task_id: str, db: Session = Depends(get_db), user_id: str = Depends(auth.get_current_user)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.owner_id == user_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    tasks_text = await extract_tasks(f"Generate 3 to 5 subtasks for the following task: {db_task.title}")
    
    # Process tasks text into a list (assuming bullet points)
    subtasks = [t.strip().lstrip('-').lstrip('*').strip() for t in tasks_text.split('\n') if t.strip() and ('-' in t or '*' in t or t[0].isdigit())]
    if not subtasks:
        subtasks = [tasks_text.strip()]

    db_task.subtasks = subtasks
    db_task.ai_generated = True
    db.commit()
    db.refresh(db_task)
    return db_task

# --- Notes ---

@app.get("/notes", response_model=list[schemas.NoteResponse])
def get_notes(db: Session = Depends(get_db), user_id: str = Depends(auth.get_current_user)):
    user = get_or_create_user(db, user_id)
    return db.query(models.Note).filter(models.Note.owner_id == user_id).order_by(models.Note.created_at.desc()).all()

@app.post("/notes", response_model=schemas.NoteResponse)
def create_note(note: schemas.NoteCreate, db: Session = Depends(get_db), user_id: str = Depends(auth.get_current_user)):
    user = get_or_create_user(db, user_id)
    db_note = models.Note(
        id=str(uuid.uuid4()),
        owner_id=user_id,
        title=note.title,
        content=note.content,
        ai_summary=note.ai_summary,
        ai_tasks=note.ai_tasks
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

@app.patch("/notes/{note_id}", response_model=schemas.NoteResponse)
def update_note(note_id: str, note: schemas.NoteUpdate, db: Session = Depends(get_db), user_id: str = Depends(auth.get_current_user)):
    db_note = db.query(models.Note).filter(models.Note.id == note_id, models.Note.owner_id == user_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    update_data = note.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_note, key, value)
    
    db.commit()
    db.refresh(db_note)
    return db_note

@app.delete("/notes/{note_id}")
def delete_note(note_id: str, db: Session = Depends(get_db), user_id: str = Depends(auth.get_current_user)):
    db_note = db.query(models.Note).filter(models.Note.id == note_id, models.Note.owner_id == user_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(db_note)
    db.commit()
    return {"status": "deleted"}

@app.post("/notes/{note_id}/ai-summarize", response_model=schemas.NoteResponse)
async def ai_summarize_note(note_id: str, db: Session = Depends(get_db), user_id: str = Depends(auth.get_current_user)):
    db_note = db.query(models.Note).filter(models.Note.id == note_id, models.Note.owner_id == user_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    summary = await summarize_text(db_note.content)
    db_note.ai_summary = summary
    db.commit()
    db.refresh(db_note)
    return db_note

@app.post("/notes/{note_id}/ai-tasks", response_model=schemas.NoteResponse)
async def ai_extract_note_tasks(note_id: str, db: Session = Depends(get_db), user_id: str = Depends(auth.get_current_user)):
    db_note = db.query(models.Note).filter(models.Note.id == note_id, models.Note.owner_id == user_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    tasks_text = await extract_tasks(db_note.content)
    subtasks = [t.strip().lstrip('-').lstrip('*').strip() for t in tasks_text.split('\n') if t.strip() and ('-' in t or '*' in t or t[0].isdigit())]
    if not subtasks:
        subtasks = [tasks_text.strip()]

    db_note.ai_tasks = subtasks
    db.commit()
    db.refresh(db_note)
    return db_note
