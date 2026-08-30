import enum
from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Float, DateTime, Date, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from ..database import Base

class AttendanceStatus(str, enum.Enum):
    PRESENT = "PRESENT"
    LATE = "LATE"
    ABSENT = "ABSENT"
    HALF_DAY = "HALF_DAY"
    EXCUSED = "EXCUSED"

class VerificationMode(str, enum.Enum):
    FACE_AUTO = "FACE_AUTO"
    ADMIN_MANUAL = "ADMIN_MANUAL"

class AttendanceRecord(Base):
    __tablename__ = "attendance_records"

    id = Column(Integer, primary_key=True, index=True)
    person_id = Column(Integer, ForeignKey("persons.id"), nullable=False)
    date = Column(Date, default=date.today, index=True, nullable=False)
    
    check_in_time = Column(DateTime, nullable=True)
    check_out_time = Column(DateTime, nullable=True)
    
    status = Column(Enum(AttendanceStatus), default=AttendanceStatus.PRESENT, index=True, nullable=False)
    recognition_confidence = Column(Float, default=1.0, nullable=False) # 0.0 to 1.0 (e.g. 0.95 = 95%)
    liveness_score = Column(Float, default=1.0, nullable=False)
    verification_mode = Column(Enum(VerificationMode), default=VerificationMode.FACE_AUTO, nullable=False)
    
    snapshot_url = Column(String(255), nullable=True) # Check-in verification thumbnail
    
    # Audit trail for manual edits
    modified_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    modification_reason = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    person = relationship("Person", back_populates="attendance_records")
