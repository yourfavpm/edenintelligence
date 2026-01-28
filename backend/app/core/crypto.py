from typing import Optional
from app.core.config import settings
import base64
import logging

logger = logging.getLogger(__name__)

try:
    from cryptography.fernet import Fernet, InvalidToken
    _HAS_CRYPTO = True
except Exception:
    Fernet = None
    InvalidToken = Exception
    _HAS_CRYPTO = False


def _get_fernet() -> Optional["Fernet"]:
    key = settings.ENCRYPTION_KEY
    if not key:
        return None
    if not _HAS_CRYPTO:
        logger.warning("cryptography not installed; encryption disabled")
        return None
    # Allow raw key or urlsafe base64
    try:
        # if key looks like bytes base64, ensure correct length
        if isinstance(key, str):
            k = key.encode()
        else:
            k = key
        # ensure urlsafe base64 length; if short, derive via urlsafe_b64encode
        if len(k) != 44:
            k = base64.urlsafe_b64encode(k)[:44]
        return Fernet(k)
    except Exception:
        logger.exception("Failed to initialize Fernet with provided ENCRYPTION_KEY")
        return None


def encrypt_text(plaintext: str) -> str:
    f = _get_fernet()
    if not f:
        return plaintext
    return f.encrypt(plaintext.encode()).decode()


def decrypt_text(ciphertext: str) -> str:
    f = _get_fernet()
    if not f:
        return ciphertext
    try:
        return f.decrypt(ciphertext.encode()).decode()
    except InvalidToken:
        logger.exception("Invalid token when decrypting")
        return ciphertext
