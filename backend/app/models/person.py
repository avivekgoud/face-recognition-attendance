from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from ..database import Base

class Person(Base):
    __tablename__ = "persons"

    id = Column(Integer, primary_key=True, index=True)
    identifier = Column(String(50), unique=True, index=True, nullable=False) # Employee/Student ID
    full_name = Column(String(100), index=True, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    email = Column(String(100), nullable=True)
    phone = Column(String(25), nullable=True)
    designation = Column(String(100), default="Member", nullable=False) # Job Title / Grade / Role
    profile_photo_url = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)
    
    # Biometric Privacy & Consent
    consent_given = Column(Boolean, default=False, nullable=False)
    consent_timestamp = Column(DateTime, nullable=True)
    consent_version = Column(String(20), default="1.0", nullable=True)
    
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    department = relationship("Department", back_populates="persons")
    biometrics = relationship("BiometricFace", back_populates="person", cascade="all, delete-orphan")
    attendance_records = relationship("AttendanceRecord", back_populates="person", cascade="all, delete-orphan")
