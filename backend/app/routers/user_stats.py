from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db, UserDB
import datetime

router = APIRouter(prefix="/stats", tags=["User Stats"])

@router.get("/{username}")
def get_user_stats(username: str, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.username == username).first()
    if not user:
        return {"streak": 1, "xp": 50}
    
    # Simple Streak Maintenance logic
    today = datetime.datetime.utcnow().date()
    last_date = user.last_active.date()
    
    if (today - last_date).days == 1:
        user.streak_count += 1
        user.xp_points += 20
    elif (today - last_date).days > 1:
        user.streak_count = 1
        
    user.last_active = datetime.datetime.utcnow()
    db.commit()
    
    return {"streak": user.streak_count, "xp": user.xp_points}
