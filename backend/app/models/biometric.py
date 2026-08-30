from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from ..database import Base

class BiometricFace(Base):
    __tablename__ = "biometric_faces"

    id = Column(Integer, primary_key=True, index=True)
    person_id = Column(Integer, ForeignKey("persons.id"), nullable=False)
    
    # Encrypted 128-D/512-D embedding payload (AES-256 Fernet encrypted)
    encrypted_embedding = Column(Text, nullable=False)
    
    angle_label = Column(String(50), default="front", nullable=False) # front, left, right, expression
    quality_score = Column(Float, default=1.0, nullable=False)
    image_path = Column(String(255), nullable=True) # Reference to local capture file
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    person = relationship("Person", back_populates="biometrics")
