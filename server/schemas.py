from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class TaskBase(BaseModel):
    title: str
    priority: str = "Medium"
    status: str = "todo"
    due: str
    subtasks: List[str] = []
    ai_generated: bool = False

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    due: Optional[str] = None
    subtasks: Optional[List[str]] = None

class TaskResponse(TaskBase):
    id: str
    owner_id: str
    created_at: datetime

    class Config:
        from_attributes = True

class NoteBase(BaseModel):
    title: str
    content: str
    ai_summary: Optional[str] = None
    ai_tasks: List[str] = []

class NoteCreate(NoteBase):
    pass

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    ai_summary: Optional[str] = None
    ai_tasks: Optional[List[str]] = None

class NoteResponse(NoteBase):
    id: str
    owner_id: str
    created_at: datetime

    class Config:
        from_attributes = True
