from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.certificate import Certificate
from app.repositories.certificate import CertificateRepository
from app.schemas.certificate import CertificateCreate, CertificateUpdate


class CertificateService:
    def __init__(self, db: Session) -> None:
        self._repo = CertificateRepository(db)

    def get_or_404(self, cert_id: int) -> Certificate:
        cert = self._repo.get(cert_id)
        if not cert:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Certificate record not found",
            )
        return cert

    def list_all(self) -> list[Certificate]:
        return self._repo.list_ordered()

    def create(self, schema: CertificateCreate) -> Certificate:
        return self._repo.create(schema)

    def update(self, cert_id: int, schema: CertificateUpdate) -> Certificate:
        cert = self.get_or_404(cert_id)
        return self._repo.update(cert, schema)

    def delete(self, cert_id: int) -> None:
        cert = self.get_or_404(cert_id)
        self._repo.delete(cert)

