import os
from pathlib import Path
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
UPLOADS_DIR = DATA_DIR / "uploads"
STATIC_DIR = BASE_DIR / "static"

DATA_DIR.mkdir(parents=True, exist_ok=True)
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

def _load_or_generate_key(env_var: str, filename: str, is_fernet: bool = False) -> str:
    """Loads a secret from environment, local persistent data file, or generates a secure random key."""
    val = os.getenv(env_var)
    if val and val.strip():
        return val.strip()

    key_path = DATA_DIR / filename
    try:
        if key_path.exists():
            content = key_path.read_text(encoding="utf-8").strip()
            if content:
                return content
    except Exception:
        pass

    if is_fernet:
        from cryptography.fernet import Fernet
        new_val = Fernet.generate_key().decode("utf-8")
    else:
        import secrets
        new_val = secrets.token_hex(32)

    try:
        key_path.write_text(new_val, encoding="utf-8")
    except Exception:
        pass

    return new_val

class Settings(BaseModel):
    PROJECT_NAME: str = "FaceSync Attendance"
    PROJECT_VERSION: str = "2.0.0"
    ORGANIZATION_NAME: str = "FaceSync AI"
    
    # Database
    DATABASE_URL: str = f"sqlite:///{DATA_DIR / 'attendance.db'}"
    
    # Security & Cryptography (Dynamic & Secure: never hardcode secrets)
    SECRET_KEY: str = _load_or_generate_key("SECRET_KEY", ".secret_key", is_fernet=False)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # AES-256 Fernet Key for Biometric Vector Encryption (32 url-safe base64-encoded bytes)
    BIOMETRIC_ENCRYPTION_KEY: str = _load_or_generate_key("BIOMETRIC_ENCRYPTION_KEY", ".biometric_key", is_fernet=True)
    
    # Face Recognition Thresholds
    FACE_SIMILARITY_THRESHOLD: float = 0.65  # Calibrated cosine similarity threshold (0.0 to 1.0)
    LIVENESS_THRESHOLD: float = 0.55         # Liveness confidence score
    DUPLICATE_COOLDOWN_MINUTES: int = 15     # Cooldown before registering another check-in
    
    # Attendance Policy Defaults
    STANDARD_WORK_START: str = "09:00"       # 09:00 AM
    LATE_GRACE_MINUTES: int = 15             # Late after 09:15 AM
    STANDARD_WORK_END: str = "17:00"         # 05:00 PM
    WORKING_DAYS: list[int] = [0, 1, 2, 3, 4] # Mon - Fri (0 = Monday)

settings = Settings()
