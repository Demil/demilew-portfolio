from datetime import date
import pytest
from sqlalchemy import create_engine
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, sessionmaker

from app.core.database import Base
from app.models import (
    AdminUser,
    Certificate,
    ContactMessage,
    Education,
    Experience,
    Media,
    Profile,
    Project,
    ProjectTechnology,
    PublishingStatus,
    Research,
    SiteSettings,
    Skill,
    SkillCategory,
    SocialLink,
)

# Test in-memory SQLite engine
engine = create_engine("sqlite:///:memory:")
TestSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(autouse=True)
def setup_tables():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def session():
    connection = engine.connect()
    transaction = connection.begin()
    db = TestSession(bind=connection)
    yield db
    db.close()
    transaction.rollback()
    connection.close()


def test_admin_user_creation_and_uniqueness(session: Session):
    user = AdminUser(email="admin@demilew.com", password_hash="argon2id$hashed")
    session.add(user)
    session.commit()
    assert user.id is not None
    assert user.is_active is True

    # Duplicate email must fail
    duplicate = AdminUser(email="admin@demilew.com", password_hash="another$hash")
    session.add(duplicate)
    with pytest.raises(IntegrityError):
        session.commit()
    session.rollback()


def test_media_and_profile_relationships(session: Session):
    # Create media document
    cv_media = Media(
        filename="demilew_cv.pdf",
        file_path="/uploads/docs/demilew_cv.pdf",
        mime_type="application/pdf",
        file_size_bytes=204800,
        alt_text="Demilew Terefe Curriculum Vitae",
    )
    session.add(cv_media)
    session.commit()

    # Create profile linked to CV
    profile = Profile(
        full_name="Demilew Terefe",
        headline="Full-Stack Engineer & AI Solutions Architect",
        biography="Experienced engineer with focus on FastAPI, Next.js, and AI systems.",
        location="Ethiopia",
        email="demilew@example.com",
        cv_media_id=cv_media.id,
    )
    # Add relational social links
    profile.social_links.append(
        SocialLink(platform="GitHub", url="https://github.com", display_order=1)
    )
    profile.social_links.append(
        SocialLink(platform="LinkedIn", url="https://linkedin.com", display_order=2)
    )
    session.add(profile)
    session.commit()

    assert profile.id is not None
    assert len(profile.social_links) == 2
    assert profile.cv_media_id == cv_media.id


def test_project_and_relational_technologies(session: Session):
    project = Project(
        title="CNN–LSTM Anomaly Detection",
        slug="cnn-lstm-anomaly-detection",
        description="Zero-day and low-frequency network intrusion detection framework.",
        status=PublishingStatus.PUBLISHED,
        featured=True,
        display_order=1,
    )
    # Normalized relational technologies (no raw JSON arrays)
    project.technologies.append(ProjectTechnology(name="Python"))
    project.technologies.append(ProjectTechnology(name="TensorFlow"))
    project.technologies.append(ProjectTechnology(name="FastAPI"))

    session.add(project)
    session.commit()

    assert project.id is not None
    assert project.status == PublishingStatus.PUBLISHED
    assert len(project.technologies) == 3
    assert project.technologies[0].name == "Python"

    # Duplicate slug must fail
    dup_project = Project(
        title="Duplicate",
        slug="cnn-lstm-anomaly-detection",
        description="Duplicate slug test",
    )
    session.add(dup_project)
    with pytest.raises(IntegrityError):
        session.commit()
    session.rollback()


def test_publishing_status_lifecycle(session: Session):
    research = Research(
        title="Privacy-Preserving Deepfake Detection",
        slug="deepfake-detection",
        description="Multimodal deepfake detection using federated learning.",
        status=PublishingStatus.DRAFT,
    )
    session.add(research)
    session.commit()
    assert research.status == PublishingStatus.DRAFT

    # Transition to Published
    research.status = PublishingStatus.PUBLISHED
    session.commit()
    assert research.status == PublishingStatus.PUBLISHED

    # Transition to Archived
    research.status = PublishingStatus.ARCHIVED
    session.commit()
    assert research.status == PublishingStatus.ARCHIVED


def test_skills_and_categories(session: Session):
    skill = Skill(
        name="FastAPI",
        category=SkillCategory.BACKEND,
        display_order=1,
        status=PublishingStatus.PUBLISHED,
    )
    session.add(skill)
    session.commit()

    assert skill.id is not None
    assert skill.category == SkillCategory.BACKEND
    assert skill.status == PublishingStatus.PUBLISHED


def test_experience_and_education(session: Session):
    exp = Experience(
        company="Huawei Technologies Ethiopia",
        role="Project Control Manager (PCM)",
        description="Telecom infrastructure project coordination and risk mitigation.",
        start_date=date(2022, 10, 1),
        is_current=True,
        status=PublishingStatus.PUBLISHED,
    )
    edu = Education(
        institution="Bahir Dar University",
        degree="B.Sc. Software Engineering",
        field="Software Engineering",
        start_date=date(2017, 9, 1),
        end_date=date(2022, 6, 30),
        cgpa="3.84/4.00",
        status=PublishingStatus.PUBLISHED,
    )
    session.add_all([exp, edu])
    session.commit()

    assert exp.id is not None
    assert exp.is_current is True
    assert edu.id is not None
    assert edu.cgpa == "3.84/4.00"


def test_contact_messages_and_site_settings(session: Session):
    msg = ContactMessage(
        name="Academic Reviewer",
        email="reviewer@university.edu",
        subject="Research Inquiries",
        message="I reviewed your CNN-LSTM research paper and would like to connect.",
        read=False,
    )
    setting = SiteSettings(
        key="site_title",
        value="Demilew Terefe | Personal Portfolio & Research",
        description="Public title tag for SEO",
    )
    session.add_all([msg, setting])
    session.commit()

    assert msg.id is not None
    assert msg.read is False
    assert setting.id is not None
    assert setting.key == "site_title"

