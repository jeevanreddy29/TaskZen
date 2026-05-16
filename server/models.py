from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True) # Clerk user ID
    email = Column(String, unique=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    tasks = relationship("Task", back_populates="owner")
    notes = relationship("Note", back_populates="owner")

class Task(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True)
    priority = Column(String, default="Medium")
    status = Column(String, default="todo")
    due = Column(String)
    subtasks = Column(JSON, default=[])
    ai_generated = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    owner_id = Column(String, ForeignKey("users.id"))
    owner = relationship("User", back_populates="tasks")

class Note(Base):
    __tablename__ = "notes"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(String)
    ai_summary = Column(String, nullable=True)
    ai_tasks = Column(JSON, default=[])
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner_id = Column(String, ForeignKey("users.id"))
    owner = relationship("User", back_populates="notes")
