from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from ..database import Base

class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    code = Column(String(20), unique=True, index=True, nullable=False)
    description = Column(String(255), nullable=True)
    shift_start_time = Column(String(5), default="09:00", nullable=False) # HH:MM format
    shift_late_threshold_mins = Column(Integer, default=15, nullable=False)
    shift_end_time = Column(String(5), default="17:00", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    persons = relationship("Person", back_populates="department", cascade="all, delete-orphan")
