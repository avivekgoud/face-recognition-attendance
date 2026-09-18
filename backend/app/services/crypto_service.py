import json
import base64
import hashlib
from cryptography.fernet import Fernet
from ..config import settings

class CryptoService:
    def __init__(self):
        raw_key = settings.BIOMETRIC_ENCRYPTION_KEY.encode("utf-8")
        try:
            self.cipher = Fernet(raw_key)
        except Exception:
            derived_key = base64.urlsafe_b64encode(hashlib.sha256(settings.SECRET_KEY.encode()).digest())
            self.cipher = Fernet(derived_key)

        self.fallback_cipher = None
        try:
            sec_key = base64.urlsafe_b64encode(hashlib.sha256(settings.SECRET_KEY.encode()).digest())
            if sec_key != raw_key:
                self.fallback_cipher = Fernet(sec_key)
        except Exception:
            pass

    def encrypt_vector(self, vector: list[float]) -> str:
        """Encrypts a list of float numbers (face embedding vector) into an AES-256 cipher string."""
        serialized = json.dumps(vector).encode('utf-8')
        encrypted_bytes = self.cipher.encrypt(serialized)
        return encrypted_bytes.decode('utf-8')

    def decrypt_vector(self, ciphertext: str) -> list[float]:
        """Decrypts an AES-256 cipher string back into a list of float numbers."""
        try:
            decrypted_bytes = self.cipher.decrypt(ciphertext.encode('utf-8'))
            return json.loads(decrypted_bytes.decode('utf-8'))
        except Exception:
            if self.fallback_cipher:
                decrypted_bytes = self.fallback_cipher.decrypt(ciphertext.encode('utf-8'))
                return json.loads(decrypted_bytes.decode('utf-8'))
            raise

    def encrypt_text(self, text: str) -> str:
        return self.cipher.encrypt(text.encode('utf-8')).decode('utf-8')

    def decrypt_text(self, ciphertext: str) -> str:
        return self.cipher.decrypt(ciphertext.encode('utf-8')).decode('utf-8')

crypto_service = CryptoService()
