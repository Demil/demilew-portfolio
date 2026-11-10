from fastapi import APIRouter

from app.api.v1.routes.auth import router as auth_router
from app.api.v1.routes.certificates import router as certificates_router
from app.api.v1.routes.contact import router as contact_router
from app.api.v1.routes.education import router as education_router
from app.api.v1.routes.experience import router as experience_router
from app.api.v1.routes.media import router as media_router
from app.api.v1.routes.profile import router as profile_router
from app.api.v1.routes.projects import router as projects_router
from app.api.v1.routes.research import router as research_router
from app.api.v1.routes.settings import router as settings_router
from app.api.v1.routes.skills import router as skills_router

api_router = APIRouter()

# Health check
@api_router.get("/health", tags=["health"])
def api_health_check() -> dict[str, str]:
    return {"status": "ok", "api_version": "v1"}


# Resource routers
api_router.include_router(auth_router)
api_router.include_router(profile_router)
api_router.include_router(projects_router)
api_router.include_router(skills_router)
api_router.include_router(experience_router)
api_router.include_router(education_router)
api_router.include_router(research_router)
api_router.include_router(certificates_router)
api_router.include_router(contact_router)
api_router.include_router(media_router)
api_router.include_router(settings_router)
