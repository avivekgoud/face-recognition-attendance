import json
import base64
import hashlib
from cryptography.fernet import Fernet
from ..config import settings

class CryptoService:
    def __init__(self):
        # Derive a valid 32-byte url-safe base64 key from settings.SECRET_KEY or BIOMETRIC_ENCRYPTION_KEY
        raw_key = settings.BIOMETRIC_ENCRYPTION_KEY.encode()
        try:
            self.cipher = Fernet(raw_key)
        except Exception:
            # Fallback to key derived from SHA-256 of SECRET_KEY
            derived_key = base64.urlsafe_b64encode(hashlib.sha256(settings.SECRET_KEY.encode()).digest())
            self.cipher = Fernet(derived_key)

    def encrypt_vector(self, vector: list[float]) -> str:
        """Encrypts a list of float numbers (face embedding vector) into an AES-256 cipher string."""
        serialized = json.dumps(vector).encode('utf-8')
        encrypted_bytes = self.cipher.encrypt(serialized)
        return encrypted_bytes.decode('utf-8')

    def decrypt_vector(self, ciphertext: str) -> list[float]:
        """Decrypts an AES-256 cipher string back into a list of float numbers."""
        decrypted_bytes = self.cipher.decrypt(ciphertext.encode('utf-8'))
        return json.loads(decrypted_bytes.decode('utf-8'))

    def encrypt_text(self, text: str) -> str:
        return self.cipher.encrypt(text.encode('utf-8')).decode('utf-8')

    def decrypt_text(self, ciphertext: str) -> str:
        return self.cipher.decrypt(ciphertext.encode('utf-8')).decode('utf-8')

crypto_service = CryptoService()
