"""Database seeder populating Demilew Terefe's verified portfolio data.
Strictly adheres to Section 2 of PROJECT_INSTRUCTIONS.md.
"""

from datetime import date
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.enums import PublishingStatus, SkillCategory
from app.models.profile import Profile
from app.models.social_link import SocialLink
from app.models.project import Project, ProjectTechnology
from app.models.experience import Experience
from app.models.education import Education
from app.models.research import Research
from app.models.skill import Skill
from app.models.site_settings import SiteSettings


def seed_database(db: Session) -> None:
    # 1. Profile
    if db.query(Profile).count() == 0:
        profile = Profile(
            full_name="Demilew Terefe",
            headline="AI & Backend Software Engineer | Applied Machine Learning & Systems",
            biography=(
                "Software Engineer and Applied AI Researcher with a strong focus on distributed backend architectures, "
                "machine learning security, and privacy-preserving AI. Graduated with a Bachelor of Science in Software "
                "Engineering from Bahir Dar University with high distinction (CGPA 3.84/4.00). Extensive industry experience "
                "in telecom infrastructure project control at Huawei Technologies and data science engineering at the "
                "Information Network Security Administration (INSA)."
            ),
            location="Addis Ababa, Ethiopia",
            email="contact@demilewterefe.com",
        )
        db.add(profile)
        db.flush()

        # Social Links
        socials = [
            SocialLink(
                profile_id=profile.id,
                platform="LinkedIn",
                url="https://linkedin.com",
                display_order=1,
                is_visible=True,
            ),
            SocialLink(
                profile_id=profile.id,
                platform="GitHub",
                url="https://github.com",
                display_order=2,
                is_visible=True,
            ),
            SocialLink(
                profile_id=profile.id,
                platform="Email",
                url="mailto:contact@demilewterefe.com",
                display_order=3,
                is_visible=True,
            ),
        ]
        db.add_all(socials)
        print("✓ Profile and social links seeded.")

    # 2. Education
    if db.query(Education).count() == 0:
        edu = Education(
            institution="Bahir Dar University",
            degree="Bachelor of Science",
            field="Software Engineering",
            start_date=date(2017, 10, 1),
            end_date=date(2022, 7, 1),
            cgpa="3.84 / 4.00",
            display_order=1,
            status=PublishingStatus.PUBLISHED,
        )
        db.add(edu)
        print("✓ Education record seeded (BDU, CGPA 3.84/4.00).")

    # 3. Experience
    if db.query(Experience).count() == 0:
        exp1 = Experience(
            company="Huawei Technologies Ethiopia PLC",
            role="Project Control Manager (PCM)",
            description=(
                "Overseeing telecom infrastructure project coordination, project planning, and execution control. "
                "Responsible for resource planning, project risk mitigation, progress monitoring, and managing "
                "telecom power infrastructure projects across regional deployments."
            ),
            start_date=date(2022, 9, 1),
            end_date=None,
            is_current=True,
            display_order=1,
            status=PublishingStatus.PUBLISHED,
        )
        exp2 = Experience(
            company="Information Network Security Administration (INSA)",
            role="Data Science Engineer",
            description=(
                "Developed machine learning and deep learning pipelines, natural language processing models, "
                "and high-performance backend microservices using FastAPI, Flask, and Django. Implemented data processing "
                "workflows and applied AI solutions for security applications."
            ),
            start_date=date(2022, 1, 1),
            end_date=date(2022, 8, 31),
            is_current=False,
            display_order=2,
            status=PublishingStatus.PUBLISHED,
        )
        db.add_all([exp1, exp2])
        print("✓ Professional experience seeded (Huawei PCM & INSA Data Science Engineer).")

    # 4. Featured Projects (Strictly the 3 approved projects from Section 2.4)
    if db.query(Project).count() == 0:
        proj1 = Project(
            title="CNN–LSTM Based Anomaly Detection for Zero-Day and Low-Frequency Network Intrusions",
            slug="cnn-lstm-network-intrusion-detection",
            description=(
                "Deep learning framework utilizing hybrid CNN-LSTM architectures for real-time anomaly detection in "
                "network traffic, specifically designed to identify zero-day and low-frequency intrusions."
            ),
            problem_statement=(
                "Modern network perimeters face sophisticated polymorphic attacks and low-frequency intrusion patterns "
                "that evade traditional signature-based detection systems."
            ),
            technical_approach=(
                "Combines 1D Convolutional Neural Networks for spatial feature extraction with Long Short-Term Memory (LSTM) "
                "layers to capture temporal traffic dependencies across packet telemetry."
            ),
            featured=True,
            display_order=1,
            status=PublishingStatus.PUBLISHED,
        )
        db.add(proj1)
        db.flush()
        for tech in ["Python", "PyTorch", "TensorFlow", "FastAPI", "Pandas", "Scikit-Learn"]:
            db.add(ProjectTechnology(project_id=proj1.id, name=tech))

        proj2 = Project(
            title="AI-Enhanced Social Engineering and Deepfake Detection: A Privacy-Preserving Framework",
            slug="privacy-preserving-deepfake-detection",
            description=(
                "Privacy-preserving multimodal framework for detecting AI-generated media manipulations and social "
                "engineering attacks using Federated Learning and Differential Privacy."
            ),
            problem_statement=(
                "The rise of generative synthetic media enables targeted social engineering while data privacy regulations "
                "prevent centralizing sensitive biometric audio/visual data."
            ),
            technical_approach=(
                "Leverages decentralized Federated Learning combined with Differential Privacy noise perturbation to "
                "train multimodal detection networks across distributed nodes without exposing raw media."
            ),
            featured=True,
            display_order=2,
            status=PublishingStatus.PUBLISHED,
        )
        db.add(proj2)
        db.flush()
        for tech in ["Python", "PyTorch", "Federated Learning", "Differential Privacy", "OpenCV", "FastAPI"]:
            db.add(ProjectTechnology(project_id=proj2.id, name=tech))

        proj3 = Project(
            title="Dashen Smart AI — Intelligent Document Retrieval and Question Answering",
            slug="dashen-smart-ai",
            description=(
                "Authorized-document Retrieval-Augmented Generation (RAG) application providing accurate question answering "
                "over private institutional documents with native support for Amharic and English."
            ),
            problem_statement=(
                "Financial and corporate institutions struggle to quickly retrieve precise answers from extensive private "
                "document repositories in localized languages."
            ),
            technical_approach=(
                "Combines dense vector embeddings, cross-lingual semantic re-ranking, domain-specific tokenization for "
                "Ethiopic script, and strict role-based document access controls."
            ),
            featured=True,
            display_order=3,
            status=PublishingStatus.PUBLISHED,
        )
        db.add(proj3)
        db.flush()
        for tech in ["Python", "FastAPI", "Vector DB", "RAG", "LangChain", "PostgreSQL", "Next.js"]:
            db.add(ProjectTechnology(project_id=proj3.id, name=tech))

        print("✓ 3 Approved Featured Projects seeded.")

    # 5. Research
    if db.query(Research).count() == 0:
        res1 = Research(
            title="Zero-Day Anomaly Detection in High-Throughput Network Perimeters",
            slug="zero-day-network-anomaly-detection",
            description="Deep representation learning and temporal sequence models to identify subtle zero-day deviations in network packet telemetry.",
            methodology="Hybrid convolutional recurrent networks evaluated on modern network intrusion benchmarks.",
            display_order=1,
            status=PublishingStatus.PUBLISHED,
        )
        res2 = Research(
            title="Privacy-Preserving Federated Learning Architectures for Sensitive Multimodal Data",
            slug="federated-learning-privacy-preserving-ai",
            description="Decentralized model training using Differential Privacy noise perturbation to prevent biometric leakage in deepfake detection.",
            methodology="Client-side differential privacy with noise calibration and communication-efficient aggregation.",
            display_order=2,
            status=PublishingStatus.PUBLISHED,
        )
        res3 = Research(
            title="Cross-Lingual Retrieval-Augmented Generation for Low-Resource Ethiopic Languages",
            slug="cross-lingual-rag-ethiopic",
            description="Tokenization, semantic alignment, and dense retrieval techniques for low-resource languages including Amharic.",
            methodology="Subword vocabulary adaptation, contrastive embeddings, and multilingual bi-encoders.",
            display_order=3,
            status=PublishingStatus.PUBLISHED,
        )
        db.add_all([res1, res2, res3])
        print("✓ Research initiatives seeded.")

    # 6. Skills
    if db.query(Skill).count() == 0:
        skills_data = [
            # Backend
            ("Python", SkillCategory.BACKEND, 1),
            ("FastAPI", SkillCategory.BACKEND, 2),
            ("Flask & Django", SkillCategory.BACKEND, 3),
            ("SQLAlchemy 2.0", SkillCategory.BACKEND, 4),
            ("PostgreSQL", SkillCategory.BACKEND, 5),
            ("RESTful API Design", SkillCategory.BACKEND, 6),
            ("Microservices Architecture", SkillCategory.BACKEND, 7),
            # AI / Machine Learning (Under Other category in DB enum)
            ("PyTorch & TensorFlow", SkillCategory.OTHER, 8),
            ("Deep Learning & CNN-LSTM", SkillCategory.OTHER, 9),
            ("Natural Language Processing (NLP)", SkillCategory.OTHER, 10),
            ("Retrieval-Augmented Generation (RAG)", SkillCategory.OTHER, 11),
            ("Federated Learning & Privacy AI", SkillCategory.OTHER, 12),
            ("Network Intrusion Detection", SkillCategory.OTHER, 13),
            # DevOps & Cloud
            ("Docker & Docker Compose", SkillCategory.DEVOPS, 14),
            ("Linux & Bash Scripting", SkillCategory.DEVOPS, 15),
            ("Git & Monorepo Workflows", SkillCategory.DEVOPS, 16),
            ("CI/CD Automation", SkillCategory.DEVOPS, 17),
            # Frontend
            ("TypeScript", SkillCategory.FRONTEND, 18),
            ("React", SkillCategory.FRONTEND, 19),
            ("Next.js (App Router)", SkillCategory.FRONTEND, 20),
            ("Tailwind CSS", SkillCategory.FRONTEND, 21),
        ]
        for name, cat, order in skills_data:
            db.add(Skill(name=name, category=cat, display_order=order, status=PublishingStatus.PUBLISHED))
        print("✓ Categorized skills seeded.")

    # 7. Site Settings
    settings_data = [
        ("site_title", "Demilew Terefe — AI & Backend Software Engineer", "Browser title"),
        ("site_tagline", "Specializing in applied machine learning, AI security, and resilient backend systems.", "Hero headline"),
        ("meta_description", "Personal portfolio and research platform of Demilew Terefe, AI and Backend Software Engineer.", "SEO description"),
        ("contact_email", "contact@demilewterefe.com", "Public contact address"),
        ("availability_status", "Available for select software engineering opportunities & research collaborations", "Status banner"),
    ]
    for key, val, desc in settings_data:
        existing = db.query(SiteSettings).filter(SiteSettings.key == key).first()
        if not existing:
            db.add(SiteSettings(key=key, value=val, description=desc))
    print("✓ Site settings seeded.")

    db.commit()
    print("Database seeding completed successfully.")


if __name__ == "__main__":
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
