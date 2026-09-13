from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db, UserDB, TaskDB

router = APIRouter(prefix="/analytics", tags=["System Analytics"])

@router.get("/user/{username}")
def get_detailed_analytics(username: str, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.username == username).first()
    total_tasks = db.query(TaskDB).filter(TaskDB.username == username).count()
    completed_tasks = db.query(TaskDB).filter(TaskDB.username == username, TaskDB.is_completed == True).count()
    
    streak = user.streak_count if user else 1
    xp = user.xp_points if user else 50
    level = (xp // 100) + 1
    
    completion_rate = round((completed_tasks / total_tasks * 100), 1) if total_tasks > 0 else 0.0
    
    return {
        "username": username,
        "streak_count": streak,
        "xp_points": xp,
        "operator_level": level,
        "task_metrics": {
            "total": total_tasks,
            "completed": completed_tasks,
            "completion_rate": f"{completion_rate}%"
        },
        "system_status": "OPTIMAL"
    }
