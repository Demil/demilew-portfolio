"""Generic base repository providing common CRUD operations.

Each concrete repository inherits from this and adds model-specific queries.
The base only deals with the ORM session — no business logic lives here.
"""
from typing import Any, Generic, TypeVar

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import Base

ModelT = TypeVar("ModelT", bound=Base)


class BaseRepository(Generic[ModelT]):
    """CRUD scaffolding for any SQLAlchemy model."""

    def __init__(self, model: type[ModelT], db: Session) -> None:
        self._model = model
        self._db = db

    # ------------------------------------------------------------------
    # Read helpers
    # ------------------------------------------------------------------

    def get(self, id: int) -> ModelT | None:
        """Return one record by primary key, or None if not found."""
        return self._db.get(self._model, id)

    def list(self, *, skip: int = 0, limit: int = 100) -> list[ModelT]:
        """Return a paginated list of records."""
        stmt = select(self._model).offset(skip).limit(limit)
        return list(self._db.scalars(stmt).all())

    # ------------------------------------------------------------------
    # Write helpers (used internally by concrete repositories)
    # ------------------------------------------------------------------

    def _create(self, **kwargs: Any) -> ModelT:
        """Instantiate, persist, and return a new record."""
        obj = self._model(**kwargs)
        self._db.add(obj)
        self._db.commit()
        self._db.refresh(obj)
        return obj

    def _update(self, obj: ModelT, data: dict[str, Any]) -> ModelT:
        """Apply a dict of field updates to an existing record."""
        for field, value in data.items():
            setattr(obj, field, value)
        self._db.commit()
        self._db.refresh(obj)
        return obj

    def delete(self, obj: ModelT) -> None:
        """Hard-delete a record from the database."""
        self._db.delete(obj)
        self._db.commit()

