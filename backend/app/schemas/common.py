"""Shared schema utilities used across all resource schemas."""
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class TimestampSchema(BaseModel):
    """Adds read-only timestamp fields to response schemas."""

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class IDSchema(BaseModel):
    """Adds a read-only integer primary key to response schemas."""

    id: int

    model_config = ConfigDict(from_attributes=True)

