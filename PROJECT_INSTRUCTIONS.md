# PROJECT INSTRUCTIONS
## Demilew Terefe — Personal Portfolio Platform

**Document:** PROJECT_INSTRUCTIONS.md  
**Project Owner:** Demilew Terefe  
**Project Type:** Full-Stack Personal Portfolio and Content Management System  
**Development Approach:** Incremental, modular, test-driven where appropriate  
**Primary Backend Language:** Python  
**Database:** PostgreSQL

---

# 1. PROJECT OVERVIEW

## 1.1 Project Vision

Develop a professional, modern, scalable, and maintainable personal portfolio platform that represents Demilew Terefe's academic background, professional experience, software engineering capabilities, AI research interests, and technical projects.

This is not merely a static portfolio website.

It is a full-stack web application consisting of:

1. A public-facing personal portfolio website.
2. A private administrative dashboard.
3. A Python-based backend API.
4. A relational PostgreSQL database.
5. A content management system (CMS).
6. Secure authentication and authorization.
7. Media and document management.

The project should support continuous content updates without requiring modifications to frontend source code every time portfolio information changes.

## 1.2 Primary Objectives

- Establish a strong professional digital identity.
- Present academic and professional achievements.
- Showcase AI, machine learning, cybersecurity, and software engineering projects.
- Provide detailed research and project information.
- Allow the owner to manage all portfolio content through an admin dashboard.
- Maintain clean, modular, reusable, and well-documented code.
- Support future features without requiring a complete architectural redesign.

## 1.3 Target Audience

The platform should serve:

- International scholarship and university admission committees.
- Academic researchers and research collaborators.
- AI and software engineering recruiters.
- Technology companies.
- Potential clients and professional partners.

---

# 2. PROJECT OWNER PROFILE

Use the following verified information when implementing portfolio content.

## 2.1 Education

**Institution:** Bahir Dar University  
**Degree:** Bachelor of Science in Software Engineering  
**Graduation Year:** 2022  
**CGPA:** 3.84/4.00

## 2.2 Professional Experience

### Huawei Technologies Ethiopia PLC

**Position:** Project Control Manager (PCM)

Professional responsibilities and experience include:

- Telecom infrastructure project coordination.
- Project planning and control.
- Resource planning.
- Project risk mitigation.
- Progress monitoring and reporting.
- Telecom power infrastructure projects.

### Information Network Security Administration (INSA)

**Position:** Data Science Engineer

Technical experience includes:

- Machine learning.
- Deep learning.
- Natural language processing.
- Python-based data science.
- Django, Flask, and FastAPI.
- Data processing and AI application development.

## 2.3 Technical Interests

- Artificial Intelligence.
- Applied Machine Learning.
- Deep Learning.
- AI Security.
- Network Intrusion Detection.
- Privacy-Preserving AI.
- Natural Language Processing.
- Retrieval-Augmented Generation.
- Low-Resource Language AI.

## 2.4 Featured Projects

### Project 1: Network Intrusion Detection

**Title:** CNN–LSTM Based Anomaly Detection for Zero-Day and Low-Frequency Network Intrusions.

Research involving CNN–LSTM architectures for detecting anomalous network traffic, with particular attention to zero-day and low-frequency intrusions.

### Project 2: Privacy-Preserving Deepfake Detection

**Title:** AI-Enhanced Social Engineering and Deepfake Detection: A Privacy-Preserving Framework Using Federated Learning and Differential Privacy.

Research involving multimodal deepfake detection, federated learning, and differential privacy.

### Project 3: Dashen Smart AI

**Title:** Dashen Smart AI — Intelligent Document Retrieval and Question Answering.

An authorized-document retrieval-augmented generation application designed to retrieve information from private institutional documents, supporting Amharic and English.

IMPORTANT:

- Distinguish completed, ongoing, and planned projects.
- Never invent research results, performance metrics, publications, or deployment claims.
- Never invent GitHub repositories or professional links.
- Do not feature the previously excluded hate-speech detection and Smart Farming projects.

---

# 3. APPROVED TECHNOLOGY STACK

The following technology choices have been approved by the project owner.

## 3.1 Frontend

- Next.js.
- React.
- TypeScript.
- Tailwind CSS.
- Lucide React.
- Framer Motion where useful.

Use Next.js App Router.

The frontend must be responsive, accessible, maintainable, and optimized for performance.

## 3.2 Backend

- Python.
- FastAPI.
- Pydantic.
- SQLAlchemy 2.0.
- Alembic.

Use a RESTful API architecture with JSON communication.

API versioning must begin with:

`/api/v1/`

## 3.3 Database

- PostgreSQL.
- SQLAlchemy ORM.
- Alembic migrations.

PostgreSQL must run locally through Docker Compose during development.

## 3.4 Development Tools

- Google Antigravity IDE.
- Git.
- Docker.
- Python virtual environment.
- Node.js and npm.

Use compatible stable versions and document the actual versions selected.

Do not upgrade dependencies unnecessarily.

---

# 4. SYSTEM ARCHITECTURE

The application must use a modular monorepo structure.

Proposed root structure:

```text
demilew-portfolio/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── services/
│   │   ├── types/
│   │   └── styles/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── repositories/
│   │   └── main.py
│   │
│   ├── alembic/
│   ├── tests/
│   ├── requirements.txt
│   └── ...
│
├── infrastructure/
│   └── docker-compose.yml
│
├── docs/
│
├── PROJECT_INSTRUCTIONS.md
├── README.md
├── .gitignore
└── .env.example
```

This is a proposed structure, not a requirement to create empty folders.

Only create directories when they serve an actual implementation purpose.

## 4.1 Frontend Responsibilities

The frontend is responsible for:

- Rendering the public portfolio.
- Displaying published portfolio information.
- Providing the admin interface.
- Managing frontend interactions.
- Communicating with FastAPI.
- Validating user input before submission.
- Displaying loading, success, and error states.

The frontend must never communicate directly with PostgreSQL.

## 4.2 Backend Responsibilities

FastAPI is responsible for:

- REST API endpoints.
- Authentication.
- Authorization.
- Business logic.
- Request validation.
- Database operations.
- Content publishing.
- Media metadata management.
- Contact message handling.

## 4.3 Backend Layer Responsibilities

**API Layer**

Defines endpoints, HTTP methods, response codes, and request handling.

**Schema Layer**

Defines Pydantic request and response models.

**Service Layer**

Contains business rules and application logic.

**Repository Layer**

Handles database queries and persistence operations.

**Model Layer**

Defines SQLAlchemy database entities and relationships.

**Core Layer**

Handles application configuration, security, database connections, and shared infrastructure.

Maintain clear responsibilities between layers.

Avoid unnecessary abstraction and excessive indirection.

---

# 5. DATABASE ENGINEERING

## 5.1 Core Database Entities

The initial database should support:

1. AdminUser.
2. Profile.
3. Experience.
4. Education.
5. Project.
6. Skill.
7. Research.
8. Certificate.
9. SocialLink.
10. Media.
11. ContactMessage.
12. SiteSettings.

## 5.2 Database Standards

- Use relational database design.
- Define appropriate primary and foreign keys.
- Use suitable data types.
- Apply unique constraints where required.
- Create indexes for frequently queried fields.
- Use database transactions for multi-step operations.
- Maintain creation and update timestamps.
- Use Alembic for every schema migration.
- Avoid storing large binary files directly in PostgreSQL.
- Avoid unnecessary JSON-based data structures.

## 5.3 Content Publishing

Content entities that support public display should have appropriate publishing states.

At minimum:

- Draft.
- Published.
- Archived, where appropriate.

Only published content should be exposed through public API endpoints.

The admin should be able to create, edit, preview, publish, unpublish, and archive supported content.

## 5.4 Local PostgreSQL

Use Docker Compose to configure PostgreSQL.

Requirements:

- Persistent database volume.
- Environment-based credentials.
- Health check.
- Explicit port configuration.
- Database initialization.
- Documented startup and shutdown commands.

The Python backend can run independently using a virtual environment.

---

# 6. ADMIN DASHBOARD

The platform must provide a private administrative dashboard under `/admin`.

The dashboard should be a genuine CMS.

## 6.1 Admin Modules

### Dashboard

Display an overview of portfolio content and recent administrative activity.

### Profile Management

Manage:

- Name.
- Professional headline.
- Biography.
- Profile image.
- Location.
- Contact information.
- CV document.

### Experience Management

Create, update, publish, and archive professional experience.

### Project Management

Manage:

- Project title.
- Slug.
- Description.
- Problem statement.
- Technical approach.
- Technologies.
- Project status.
- Project images.
- GitHub links.
- Live demonstration links.
- Publication links.

### Research Management

Manage research topics, descriptions, research projects, and publications.

Do not represent research interests as completed publications.

### Education Management

Manage academic institutions, degrees, dates, and academic achievements.

### Skills Management

Manage skill categories, technologies, and display ordering.

Do not require arbitrary skill proficiency percentages.

### Certificate Management

Manage certificate names, issuers, dates, and document links.

### Media Management

Upload, organize, and manage images and documents.

### Contact Messages

View contact form submissions and their status.

### Settings

Manage social links, SEO metadata, and website configuration.

## 6.2 Admin User Policy

The initial platform will have one administrator.

Do not implement public registration.

Keep the architecture extensible for additional administrators in the future, but do not build a complicated role-management system prematurely.

---

# 7. SECURITY REQUIREMENTS

Security is mandatory, not an optional final-stage feature.

Implement appropriate protections throughout development.

Requirements include:

- Argon2id password hashing.
- Secure authentication.
- HTTP-only cookies for session credentials.
- CSRF protection for cookie-authenticated state-changing operations.
- Protected admin endpoints.
- Login rate limiting.
- Input validation.
- Safe database query practices.
- Secure file upload validation.
- Environment-based secrets.
- Appropriate CORS configuration.
- Secure production cookie settings.
- No hardcoded credentials.
- No public access to administrative resources.

Never commit `.env` files or sensitive credentials to Git.

Create `.env.example` with placeholder values only.

Do not log passwords, authentication tokens, or other secrets.

Do not expose unpublished content through public APIs.

---

# 8. DESIGN AND USER EXPERIENCE

## 8.1 Design Direction

The visual identity should be:

- Modern.
- Professional.
- Minimalist.
- Technical.
- Elegant.
- Dark-themed.

Use dark navy or charcoal backgrounds with carefully selected accent colors.

Maintain:

- Strong typography.
- Consistent spacing.
- Clear visual hierarchy.
- Balanced layouts.
- Reusable UI elements.
- Subtle animations.
- Professional project cards.

Avoid generic AI-generated templates, excessive gradients, excessive glassmorphism, and unnecessary decorative effects.

## 8.2 Public Pages

The initial public application should support:

- Home.
- About.
- Experience.
- Projects.
- Project details.
- Research.
- Skills.
- Education.
- Contact.

## 8.3 Responsiveness

Support:

- Desktop.
- Tablet.
- Mobile.

Implement accessible keyboard navigation, semantic HTML, readable contrast, optimized images, and reduced-motion support.

---

# 9. API DESIGN STANDARDS

All APIs must follow consistent conventions.

Use:

- Correct HTTP methods.
- Appropriate status codes.
- Consistent response structures.
- Request and response validation.
- Pagination for growing collections.
- Filtering and sorting where useful.
- Clear error responses.
- API versioning.

Public endpoints must return published content only.

Admin endpoints must require authentication and authorization.

Generate and maintain FastAPI OpenAPI documentation.

Avoid returning unnecessary database fields to the frontend.

---

# 10. FILE AND MEDIA MANAGEMENT

Support:

- Profile photographs.
- Project images.
- Research diagrams.
- CV documents.
- Certificates.

Store files in an appropriate file or object storage system.

Store file metadata and storage references in PostgreSQL.

Do not store uploaded binary files directly in database records.

Validate:

- File size.
- File type.
- File extension.
- File content where appropriate.

Use safe filenames and storage keys.

The initial development environment may use local media storage behind an abstraction that can later be replaced with S3-compatible storage.

---

# 11. DEVELOPMENT WORKFLOW

## 11.1 Incremental Development Policy

This is one of the most important project rules.

The entire application MUST NOT be generated in a single implementation operation.

Development must happen incrementally through independently testable phases.

The agent must:

1. Inspect the current workspace.
2. Understand the existing implementation.
3. Identify the current development phase.
4. Read the relevant project documentation.
5. Implement only the approved phase.
6. Run appropriate validation.
7. Report the actual results.
8. Identify outstanding issues.
9. Wait for project-owner approval before starting the next phase.

Never silently skip a phase.

Never assume a previous phase passed.

Never overwrite working implementations without justification.

## 11.2 Development Phases

### Phase 0 — Workspace Audit and Architecture

Inspect the environment, existing workspace, and dependencies.

Produce the architecture and implementation plan.

No application implementation.

### Phase 1 — Project Foundation

Initialize the frontend and backend.

Establish project structure, configurations, development scripts, and environment management.

Verify both applications can run.

### Phase 2 — Database Engineering

Configure PostgreSQL using Docker Compose.

Implement SQLAlchemy configuration, initial entities, Alembic migrations, relationships, and database validation.

### Phase 3 — Authentication and Admin Foundation

Implement administrator authentication, secure session management, protected endpoints, and dashboard layout.

### Phase 4 — Content Management Backend

Implement API endpoints and business logic for profile, projects, experience, education, research, skills, certificates, and settings.

### Phase 5 — Admin Dashboard

Implement the administrative interface and connect it to the backend.

Validate complete CRUD operations.

### Phase 6 — Public Portfolio

Implement the public website and connect it to published content APIs.

### Phase 7 — Media Management

Implement secure media uploads, metadata management, and document handling.

### Phase 8 — Testing and Optimization

Perform backend, frontend, integration, security, accessibility, and performance testing.

### Phase 9 — Deployment

Prepare production configuration, hosting, PostgreSQL deployment, domain, HTTPS, backups, and operational documentation.

---

# 12. CODE QUALITY REQUIREMENTS

Write clean, understandable, maintainable code.

## Python

- Follow PEP 8.
- Use type hints.
- Use appropriate async or synchronous database patterns consistently.
- Use clear function and variable names.
- Separate business logic from HTTP routing.
- Handle exceptions appropriately.
- Document complex logic.
- Avoid unnecessary dependencies.

## TypeScript

- Use strict TypeScript.
- Avoid unnecessary `any`.
- Prefer reusable components.
- Separate API communication from presentation.
- Maintain clear component responsibilities.
- Handle errors and loading states.

## General

- Avoid duplicated code.
- Avoid oversized files and components.
- Avoid unnecessary abstractions.
- Avoid unused dependencies.
- Avoid premature optimization.
- Keep configuration centralized.
- Document important architectural decisions.

---

# 13. TESTING AND VALIDATION

Every implementation phase must have appropriate validation.

Backend testing should cover:

- API behavior.
- Request validation.
- Database operations.
- Authentication.
- Authorization.
- Publishing rules.
- Error handling.

Frontend testing should cover:

- Page rendering.
- Navigation.
- Form validation.
- API integration.
- Authentication behavior.
- Responsive layouts.

Use appropriate testing tools, such as:

- Pytest.
- FastAPI TestClient or HTTPX.
- Vitest.
- React Testing Library.
- Playwright where end-to-end browser testing is appropriate.

Also execute:

- Python type and lint checks.
- TypeScript checks.
- Production frontend build.
- Database migration checks.

Do not report tests as successful unless they were actually executed.

Do not hide errors or disable validation to make a build appear successful.

---

# 14. DOCUMENTATION

Maintain the following documentation throughout development:

**README.md**

Project overview, installation, setup, development, and deployment.

**PROJECT_INSTRUCTIONS.md**

Permanent project requirements and development rules.

**docs/ARCHITECTURE.md**

Architecture and component responsibilities.

**docs/DATABASE.md**

Database entities, relationships, and migrations.

**docs/API.md**

API endpoints and conventions.

**docs/DEVELOPMENT.md**

Local environment setup and development commands.

**docs/DECISIONS.md**

Important technical decisions and their rationale.

Update documentation when implementation decisions change.

Do not allow documentation to contradict the actual implementation.

---

# 15. FUTURE EXTENSIBILITY

The platform should be designed to accommodate future features:

- Technical blog.
- Research publications.
- Multilingual portfolio.
- Additional AI project demonstrations.
- Analytics.
- Downloadable documents.
- Additional administrators.
- Advanced search.
- Public project APIs.

Do not implement these features unless they become part of an approved development phase.

Maintain simple architecture while preserving reasonable extensibility.

---

# 16. PROJECT OWNER CONTROL AND ACCEPTANCE

The project owner has final authority over:

- Architecture decisions.
- Technology selection.
- Design direction.
- Feature requirements.
- Content accuracy.
- Phase approval.
- Deployment decisions.

The AI development agent must not independently expand the project scope.

Before implementing a new phase, confirm that the previous phase has passed its acceptance criteria.

If a requirement is unclear, explain the ambiguity and ask for clarification instead of inventing important requirements.

For each phase, report:

1. What was implemented.
2. Files created or modified.
3. Architectural decisions.
4. Tests executed.
5. Actual test results.
6. Known limitations.
7. Outstanding issues.
8. Recommended next phase.

Do not begin the next phase without explicit approval.

---

# 17. FINAL PROJECT PRINCIPLE

Build this application as a real software engineering product.

Prioritize:

1. Correctness.
2. Security.
3. Maintainability.
4. Modularity.
5. Simplicity.
6. User experience.
7. Performance.
8. Scalability.

Do not confuse scalability with unnecessary complexity.

Do not build everything at once.

Do not prioritize visual appearance over sound engineering.

The final application must be a professional, secure, database-driven portfolio platform that the project owner can maintain and extend independently.

**Work incrementally. Validate continuously. Document decisions. Obtain approval before advancing.**

# 13. Professional UI/UX Design Standards

## 13.1 Design Philosophy

The portfolio must maintain a distinctive, professional, human-crafted visual identity.

The design should reflect the identity of a Software Engineer working in Artificial Intelligence, Deep Learning, AI Security, and Research.

The website must not look like a generic AI-generated portfolio template.

Prioritize:
- Professional visual hierarchy.
- Strong typography.
- Intentional whitespace.
- Balanced composition.
- Consistent alignment.
- Restrained color usage.
- Meaningful visual storytelling.
- Excellent readability.
- Consistent interaction patterns.

The preferred direction is a sophisticated dark editorial design, with flexibility to introduce other complementary visual elements when they improve the overall experience.

## 13.2 Avoid Generic AI-Generated UI

The following design patterns should be avoided unless there is a clear design justification:

- Excessive purple and blue gradients.
- Neon glow effects.
- Unnecessary glassmorphism.
- Random floating decorative elements.
- Repetitive rounded cards.
- Excessive technology badges and pills.
- Oversized headings without visual purpose.
- Generic AI-themed illustrations.
- Unnecessary animated backgrounds.
- Excessive scroll animations.
- Repetitive section layouts.
- Generic SaaS landing-page aesthetics.

Do not use decoration as a substitute for good design.

Every visual element must have a clear purpose.

## 13.3 Typography and Visual Hierarchy

Typography must be treated as a core design element.

Establish:
- A consistent typography system.
- Appropriate heading and body text scales.
- Readable line lengths.
- Balanced font weights.
- Consistent line heights.
- Clear distinction between primary and secondary information.

Use professional font combinations and avoid unnecessary font variations.

## 13.4 Layout and Composition

Do not force every section into the same card-based layout.

Use appropriate composition for each section:
- Editorial layouts for biography and experience.
- Featured layouts for important projects.
- Structured lists for technical skills.
- Clear chronological presentation for experience and education.
- Minimal layouts for contact information.

Use consistent spacing, grid systems, content widths, and alignment.

## 13.5 Color System

Maintain a limited and consistent color palette.

Use a dark neutral foundation, readable foreground colors, subtle secondary surfaces, and one carefully selected accent color.

Define reusable design tokens rather than hardcoding colors throughout components.

Maintain sufficient contrast and accessibility.

## 13.6 Animation and Interaction

Use restrained animation.

Interactions should feel natural, responsive, and purposeful.

Respect reduced-motion preferences.

Avoid unnecessary movement, distracting transitions, and animation that interferes with reading or navigation.

## 13.7 Responsive Design

All pages must be intentionally designed for desktop, tablet, and mobile.

Do not simply scale down desktop layouts.

Ensure appropriate typography, spacing, navigation, image proportions, content ordering, and touch targets at each breakpoint.

## 13.8 UI Quality Assurance

Before considering frontend work complete, inspect the actual rendered website.

Check:
- Visual consistency across all pages.
- Typography and spacing.
- Responsive behavior.
- Navigation and interactions.
- Loading, empty, and error states.
- Accessibility.
- Image quality and proportions.
- Browser console errors.
- Frontend performance.

Do not report visual quality based only on source code inspection.

## 13.9 UI Redesign Change-Control Rule

When a major visual redesign is required:

1. Audit the existing frontend first.
2. Identify existing components and functionality worth preserving.
3. Present a design proposal, including typography, colors, layout, and component direction.
4. Wait for the project owner's approval.
5. Implement the approved design incrementally.
6. Validate the actual rendered result.

Do not independently replace the established frontend architecture, backend, database, authentication, or API contracts during a visual redesign.

Preserve all existing working functionality unless an explicitly approved change requires otherwise.

## 13.10 Final Design Acceptance Standard

The portfolio should look like a professionally designed personal website, not an automatically generated template.

It must communicate technical credibility, research interests, professional experience, and individual identity.

The design should be distinctive without being distracting, modern without being trend-dependent, and minimal without feeling empty.