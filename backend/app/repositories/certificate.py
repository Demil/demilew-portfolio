from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.certificate import Certificate
from app.repositories.base import BaseRepository
from app.schemas.certificate import CertificateCreate, CertificateUpdate


class CertificateRepository(BaseRepository[Certificate]):
    def __init__(self, db: Session) -> None:
        super().__init__(Certificate, db)

    def list_ordered(self) -> list[Certificate]:
        stmt = select(Certificate).order_by(Certificate.display_order, Certificate.issue_date.desc())
        return list(self._db.scalars(stmt).all())

    def create(self, schema: CertificateCreate) -> Certificate:
        return self._create(**schema.model_dump())

    def update(self, cert: Certificate, schema: CertificateUpdate) -> Certificate:
        return self._update(cert, schema.model_dump(exclude_unset=True))

