from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from ..database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    username = Column(String(100), default="System", nullable=False)
    action = Column(String(100), index=True, nullable=False) # e.g., "ATTENDANCE_OVERRIDE", "BIOMETRIC_ENROLLED", "BIOMETRIC_PURGED", "USER_LOGIN"
    target_type = Column(String(50), nullable=True) # e.g., "Person", "AttendanceRecord", "Setting"
    target_id = Column(String(50), nullable=True)
    details = Column(Text, nullable=True)
    ip_address = Column(String(50), default="127.0.0.1", nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True, nullable=False)
