"""Argon2id password hashing and verification per Section 7 security requirements."""
import argon2
from argon2.exceptions import VerifyMismatchError

# Standard RFC 9106 recommended parameters for Argon2id
_ph = argon2.PasswordHasher(
    time_cost=2,
    memory_cost=65536,  # 64 MB
    parallelism=4,
    hash_len=32,
    type=argon2.Type.ID,
)


def hash_password(plain: str) -> str:
    """Return an Argon2id hash of the given plain-text password."""
    return _ph.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    """Return True if plain matches the stored Argon2id hash, False otherwise."""
    try:
        return _ph.verify(hashed, plain)
    except (VerifyMismatchError, Exception):
        return False


def needs_rehash(hashed: str) -> bool:
    """Check if the password hash should be re-hashed due to upgraded parameters."""
    return _ph.check_needs_rehash(hashed)

