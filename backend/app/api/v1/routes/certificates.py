from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.deps import get_db, require_admin
from app.schemas.certificate import CertificateCreate, CertificateRead, CertificateUpdate
from app.services.certificate import CertificateService

router = APIRouter(prefix="/certificates", tags=["certificates"])


# ── Public ────────────────────────────────────────────────────────────────────

@router.get("", response_model=list[CertificateRead], summary="List certificates")
def list_certificates(db: Session = Depends(get_db)) -> list[CertificateRead]:
    return CertificateService(db).list_all()  # type: ignore[return-value]


@router.get("/{cert_id}", response_model=CertificateRead, summary="Get certificate by ID")
def get_certificate(cert_id: int, db: Session = Depends(get_db)) -> CertificateRead:
    return CertificateService(db).get_or_404(cert_id)  # type: ignore[return-value]


# ── Admin (🔒 Protected) ──────────────────────────────────────────────────────

@router.post(
    "",
    response_model=CertificateRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create a certificate entry",
    dependencies=[Depends(require_admin)],
)
def create_certificate(
    schema: CertificateCreate,
    db: Session = Depends(get_db),
) -> CertificateRead:
    return CertificateService(db).create(schema)  # type: ignore[return-value]


@router.patch(
    "/{cert_id}",
    response_model=CertificateRead,
    summary="Update a certificate entry",
    dependencies=[Depends(require_admin)],
)
def update_certificate(
    cert_id: int,
    schema: CertificateUpdate,
    db: Session = Depends(get_db),
) -> CertificateRead:
    return CertificateService(db).update(cert_id, schema)  # type: ignore[return-value]


@router.delete(
    "/{cert_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a certificate entry",
    dependencies=[Depends(require_admin)],
)
def delete_certificate(cert_id: int, db: Session = Depends(get_db)) -> None:
    CertificateService(db).delete(cert_id)

