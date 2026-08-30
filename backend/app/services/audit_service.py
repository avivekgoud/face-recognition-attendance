from typing import Optional
from sqlalchemy.orm import Session
from ..models.audit_log import AuditLog
from ..models.user import User

class AuditService:
    @staticmethod
    def log(
        db: Session,
        action: str,
        user: Optional[User] = None,
        username: Optional[str] = None,
        target_type: Optional[str] = None,
        target_id: Optional[str] = None,
        details: Optional[str] = None,
        ip_address: str = "127.0.0.1"
    ):
        """Creates an immutable audit log entry in the database."""
        actor_name = username or (user.username if user else "System")
        actor_id = user.id if user else None
        
        log_entry = AuditLog(
            user_id=actor_id,
            username=actor_name,
            action=action,
            target_type=target_type,
            target_id=str(target_id) if target_id is not None else None,
            details=details,
            ip_address=ip_address
        )
        db.add(log_entry)
        db.commit()

audit_service = AuditService()
