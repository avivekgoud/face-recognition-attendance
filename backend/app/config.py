import os
from pathlib import Path
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
UPLOADS_DIR = DATA_DIR / "uploads"
STATIC_DIR = BASE_DIR / "static"

DATA_DIR.mkdir(parents=True, exist_ok=True)
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

class Settings(BaseModel):
    PROJECT_NAME: str = "FaceSync Attendance"
    PROJECT_VERSION: str = "2.0.0"
    ORGANIZATION_NAME: str = "Vardhaman College of Engineering"
    
    # Database
    DATABASE_URL: str = f"sqlite:///{DATA_DIR / 'attendance.db'}"
    
    # Security & Cryptography
    SECRET_KEY: str = os.getenv("SECRET_KEY", "face_attendance_jwt_secret_key_2026_super_secure_antigravity")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # AES-256 Fernet Key for Biometric Vector Encryption (32 url-safe base64-encoded bytes)
    BIOMETRIC_ENCRYPTION_KEY: str = os.getenv(
        "BIOMETRIC_ENCRYPTION_KEY", 
        "U1Z4c3J3VnBvQzdrS3BhWnJ1WHZwbk1qd1Fxc3Z4Y3Y="
    )
    
    # Face Recognition Thresholds
    FACE_SIMILARITY_THRESHOLD: float = 0.68  # Cosine similarity threshold (0.0 to 1.0)
    LIVENESS_THRESHOLD: float = 0.55         # Liveness confidence score
    DUPLICATE_COOLDOWN_MINUTES: int = 15     # Cooldown before registering another check-in
    
    # Attendance Policy Defaults
    STANDARD_WORK_START: str = "09:00"       # 09:00 AM
    LATE_GRACE_MINUTES: int = 15             # Late after 09:15 AM
    STANDARD_WORK_END: str = "17:00"         # 05:00 PM
    WORKING_DAYS: list[int] = [0, 1, 2, 3, 4] # Mon - Fri (0 = Monday)

settings = Settings()
