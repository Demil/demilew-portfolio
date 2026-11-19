import {
  INITIAL_EDUCATION,
  INITIAL_EXPERIENCES,
  INITIAL_PROFILE,
  INITIAL_PROJECTS,
  INITIAL_RESEARCH,
  INITIAL_SKILLS,
} from '@/data/mockData';
import {
  ContactSubmission,
  CvInfo,
  Education,
  Experience,
  Profile,
  Project,
  PublicSettings,
  Research,
  Skill,
} from '@/types/portfolio';

export type { CvInfo } from '@/types/portfolio';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

async function safeFetch<T>(endpoint: string, fallback: T): Promise<T> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      signal: controller.signal,
      next: { revalidate: 60 },
    }).finally(() => clearTimeout(timeoutId));

    if (!res.ok) {
      return fallback;
    }
    const data = await res.json();
    if (Array.isArray(data) && data.length === 0) {
      return fallback;
    }
    return data as T;
  } catch {
    // If backend isn't reachable or network fails, gracefully use fallback
    return fallback;
  }
}

export async function getProfile(): Promise<Profile> {
  return safeFetch<Profile>('/profile', INITIAL_PROFILE);
}

export async function getProjects(): Promise<Project[]> {
  return safeFetch<Project[]>('/projects', INITIAL_PROJECTS);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(`${API_BASE_URL}/projects/${slug}`, {
      signal: controller.signal,
      next: { revalidate: 60 },
    }).finally(() => clearTimeout(timeoutId));

    if (res.ok) {
      return (await res.json()) as Project;
    }
  } catch {
    // fallback search in INITIAL_PROJECTS
  }
  return INITIAL_PROJECTS.find((p) => p.slug === slug) || null;
}

export async function getSkills(): Promise<Skill[]> {
  return safeFetch<Skill[]>('/skills', INITIAL_SKILLS);
}

export async function getExperience(): Promise<Experience[]> {
  return safeFetch<Experience[]>('/experience', INITIAL_EXPERIENCES);
}

export async function getEducation(): Promise<Education[]> {
  return safeFetch<Education[]>('/education', INITIAL_EDUCATION);
}

export async function getResearch(): Promise<Research[]> {
  return safeFetch<Research[]>('/research', INITIAL_RESEARCH);
}

export async function getPublicSettings(): Promise<PublicSettings> {
  return safeFetch<PublicSettings>('/settings/public', {
    site_title: 'Demilew Terefe — AI Developer & Machine Learning Engineer',
    site_tagline: 'Specializing in applied machine learning, AI security, and resilient backend systems.',
    availability_status: 'Available for select software engineering opportunities & research collaborations',
    contact_email: 'contact@demilewterefe.com',
  });
}

export const DEFAULT_CV_INFO: CvInfo = {
  id: 1,
  filename: 'Demilew Terefe Mebratie (2).pdf',
  file_size_bytes: 74946,
  mime_type: 'application/pdf',
  url: '/api/v1/profile/cv/download',
  uploaded_at: '2026-11-14T16:50:50.000000Z',
};

export async function getCvInfo(): Promise<CvInfo | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(`${API_BASE_URL}/profile/cv`, {
      signal: controller.signal,
      next: { revalidate: 60 },
    }).finally(() => clearTimeout(timeoutId));
    if (!res.ok) return DEFAULT_CV_INFO;
    return (await res.json()) as CvInfo;
  } catch {
    return DEFAULT_CV_INFO;
  }
}

export async function submitContact(data: ContactSubmission): Promise<{
  success: boolean;
  message?: string;
}> {
  try {
    const res = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        success: false,
        message: err.detail || 'Failed to send message. Please try again later.',
      };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      message: 'Network error. Could not connect to the server.',
    };
  }
}
