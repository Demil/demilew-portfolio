from datetime import datetime
from pydantic import BaseModel, ConfigDict, computed_field


class MediaBase(BaseModel):
    alt_text: str | None = None


class MediaUpdate(MediaBase):
    pass


class MediaRead(MediaBase):
    id: int
    filename: str
    file_path: str
    mime_type: str
    file_size_bytes: int
    created_at: datetime

    @computed_field  # type: ignore[misc]
    @property
    def url(self) -> str:
        # Returns public direct access URL
        return f"/api/v1/media/files/{self.file_path}"

    model_config = ConfigDict(from_attributes=True)


class MediaList(BaseModel):
    total: int
    items: list[MediaRead]

