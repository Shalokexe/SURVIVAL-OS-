from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas

router = APIRouter(prefix="/api/tasks", tags=["tasks"])

@router.get("/", response_model=List[schemas.TaskItemResponse])
def get_tasks(timeframe: str = None, db: Session = Depends(get_db)):
    query = db.query(models.TaskItem)
    if timeframe:
        query = query.filter(models.TaskItem.timeframe == timeframe)
    return query.all()

@router.post("/", response_model=schemas.TaskItemResponse)
def create_task(task: schemas.TaskItemCreate, db: Session = Depends(get_db)):
    db_task = models.TaskItem(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.put("/{task_id}/toggle", response_model=schemas.TaskItemResponse)
def toggle_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(models.TaskItem).filter(models.TaskItem.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    db_task.completed = not db_task.completed
    db.commit()
    db.refresh(db_task)
    return db_task

@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(models.TaskItem).filter(models.TaskItem.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(db_task)
    db.commit()
    return {"status": "success", "message": "Task removed"}
