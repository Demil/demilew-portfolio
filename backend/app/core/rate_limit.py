"""Login rate limiting per Section 7 security requirements.

Implements an in-memory sliding-window limiter for login attempts.
Thread-safe using threading.Lock. Extensible for Redis in multi-worker production.
"""
from collections import defaultdict
from datetime import datetime, timezone
import threading
from fastapi import HTTPException, status


class LoginRateLimiter:
    """Sliding-window rate limiter for authentication attempts."""

    def __init__(self, max_attempts: int = 5, window_seconds: int = 60) -> None:
        self.max_attempts = max_attempts
        self.window_seconds = window_seconds
        self._lock = threading.Lock()
        # key -> list of UTC timestamps of failed attempts
        self._attempts: dict[str, list[float]] = defaultdict(list)

    def _cleanup_old_attempts(self, key: str, now: float) -> None:
        cutoff = now - self.window_seconds
        self._attempts[key] = [ts for ts in self._attempts[key] if ts > cutoff]

    def check_rate_limit(self, key: str) -> None:
        """Raise 429 if key has exceeded allowed failed attempts within the window."""
        now = datetime.now(timezone.utc).timestamp()
        with self._lock:
            self._cleanup_old_attempts(key, now)
            if len(self._attempts[key]) >= self.max_attempts:
                oldest = self._attempts[key][0]
                retry_after = max(1, int(self.window_seconds - (now - oldest)))
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=f"Too many failed login attempts. Please try again in {retry_after} seconds.",
                    headers={"Retry-After": str(retry_after)},
                )

    def record_failure(self, key: str) -> None:
        """Record a failed login attempt for the key."""
        now = datetime.now(timezone.utc).timestamp()
        with self._lock:
            self._cleanup_old_attempts(key, now)
            self._attempts[key].append(now)

    def record_success(self, key: str) -> None:
        """Clear recorded failures upon successful login."""
        with self._lock:
            if key in self._attempts:
                del self._attempts[key]

    def reset_all(self) -> None:
        """Clear all records (primarily for testing)."""
        with self._lock:
            self._attempts.clear()


# Default singleton instance
login_rate_limiter = LoginRateLimiter(max_attempts=5, window_seconds=60)

