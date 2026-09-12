from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db, TaskDB
from pydantic import BaseModel

router = APIRouter(prefix="/life", tags=["Life Manager"])

class TaskCreate(BaseModel):
    username: str
    task_text: str

class TaskToggle(BaseModel):
    task_id: int

@router.get("/tasks/{username}")
def get_user_tasks(username: str, db: Session = Depends(get_db)):
    tasks = db.query(TaskDB).filter(TaskDB.username == username).all()
    return {"tasks": [{"id": t.id, "text": t.task_text, "completed": t.is_completed} for t in tasks]}

@router.post("/task/add")
def add_task(payload: TaskCreate, db: Session = Depends(get_db)):
    new_task = TaskDB(username=payload.username, task_text=payload.task_text)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return {"status": "success", "task": {"id": new_task.id, "text": new_task.task_text, "completed": False}}

@router.post("/task/toggle")
def toggle_task(payload: TaskToggle, db: Session = Depends(get_db)):
    task = db.query(TaskDB).filter(TaskDB.id == payload.task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.is_completed = not task.is_completed
    db.commit()
    return {"status": "updated", "completed": task.is_completed}
