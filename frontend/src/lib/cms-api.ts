import { getCsrfToken, getStoredToken } from '@/lib/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Attach Bearer token if admin is authenticated (guarantees cross-origin auth)
  const token = getStoredToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Attach CSRF token for state-changing methods
  const method = (options.method || 'GET').toUpperCase();
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const csrf = getCsrfToken();
    if (csrf) {
      headers.set('X-CSRF-Token', csrf);
    }
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (res.status === 204) {
    return null as unknown as T;
  }

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || `HTTP Error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

// ── Profile & Social Links ───────────────────────────────────────────────────

export interface ProfileData {
  id: number;
  full_name: string;
  headline: string;
  biography: string;
  location: string;
  email: string;
  cv_media_id?: number | null;
  profile_image_media_id?: number | null;
  profile_image_url?: string | null;
  social_links: SocialLinkData[];
}

export interface PhotoMeta {
  id: number;
  filename: string;
  file_size_bytes: number;
  mime_type: string;
  url: string;
  uploaded_at: string;
}

export interface SocialLinkData {
  id: number;
  profile_id: number;
  platform: string;
  url: string;
  display_order: number;
  is_visible: boolean;
}

export const cmsProfile = {
  getAdmin: () => request<ProfileData>('/profile/admin'),
  update: (data: Partial<ProfileData>) =>
    request<ProfileData>('/profile', { method: 'PATCH', body: JSON.stringify(data) }),
  addSocialLink: (data: Omit<SocialLinkData, 'id' | 'profile_id'>) =>
    request<SocialLinkData>('/profile/social-links', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateSocialLink: (id: number, data: Partial<SocialLinkData>) =>
    request<SocialLinkData>(`/profile/social-links/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteSocialLink: (id: number) =>
    request<void>(`/profile/social-links/${id}`, { method: 'DELETE' }),

  // CV Operations
  getCv: () =>
    request<{
      id: number;
      filename: string;
      file_size_bytes: number;
      mime_type: string;
      url: string;
      uploaded_at: string;
    }>('/profile/cv'),
  uploadCv: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const csrf = getCsrfToken();
    const token = getStoredToken();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (csrf) headers['X-CSRF-Token'] = csrf;
    const res = await fetch(`${API_BASE}/profile/cv/upload`, {
      method: 'POST',
      headers,
      body: formData,
      credentials: 'include',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `Upload failed: ${res.status}`);
    }
    return res.json();
  },
  deleteCv: () => request<void>('/profile/cv', { method: 'DELETE' }),

  // Photo Operations
  getPhoto: () => request<PhotoMeta>('/profile/photo/meta'),
  uploadPhoto: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const csrf = getCsrfToken();
    const token = getStoredToken();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (csrf) headers['X-CSRF-Token'] = csrf;
    const res = await fetch(`${API_BASE}/profile/photo/upload`, {
      method: 'POST',
      headers,
      body: formData,
      credentials: 'include',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `Photo upload failed: ${res.status}`);
    }
    return res.json();
  },
  deletePhoto: () => request<void>('/profile/photo', { method: 'DELETE' }),
};

// ── Projects ─────────────────────────────────────────────────────────────────

export interface ProjectData {
  id: number;
  title: string;
  slug: string;
  description: string;
  problem_statement?: string | null;
  technical_approach?: string | null;
  tech_stack: string[];
  github_url?: string | null;
  live_url?: string | null;
  featured: boolean;
  display_order: number;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export const cmsProjects = {
  listAll: () => request<ProjectData[]>('/projects/admin/all'),
  create: (data: Partial<ProjectData>) =>
    request<ProjectData>('/projects', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<ProjectData>) =>
    request<ProjectData>(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/projects/${id}`, { method: 'DELETE' }),
};

// ── Experience ───────────────────────────────────────────────────────────────

export interface ExperienceData {
  id: number;
  company: string;
  role: string;
  description?: string | null;
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
  display_order: number;
  status: 'draft' | 'published' | 'archived';
}

export const cmsExperience = {
  listAll: () => request<ExperienceData[]>('/experience/admin/all'),
  create: (data: Partial<ExperienceData>) =>
    request<ExperienceData>('/experience', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<ExperienceData>) =>
    request<ExperienceData>(`/experience/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/experience/${id}`, { method: 'DELETE' }),
};

// ── Education ────────────────────────────────────────────────────────────────

export interface EducationData {
  id: number;
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date?: string | null;
  cgpa?: string | null;
  display_order: number;
  status: 'draft' | 'published' | 'archived';
}

export const cmsEducation = {
  listAll: () => request<EducationData[]>('/education/admin/all'),
  create: (data: Partial<EducationData>) =>
    request<EducationData>('/education', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<EducationData>) =>
    request<EducationData>(`/education/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/education/${id}`, { method: 'DELETE' }),
};

// ── Skills ───────────────────────────────────────────────────────────────────

export interface SkillData {
  id: number;
  name: string;
  category: string;
  display_order: number;
  icon_name?: string | null;
  status: 'draft' | 'published' | 'archived';
}

export const cmsSkills = {
  listAll: () => request<SkillData[]>('/skills/admin/all'),
  create: (data: Partial<SkillData>) =>
    request<SkillData>('/skills', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<SkillData>) =>
    request<SkillData>(`/skills/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/skills/${id}`, { method: 'DELETE' }),
  deleteCategory: (category: string) =>
    request<{ deleted: number }>(`/skills/category/${encodeURIComponent(category)}`, { method: 'DELETE' }),
  renameCategory: (category: string, newName: string) =>
    request<{ renamed: number }>(`/skills/category/${encodeURIComponent(category)}/rename`, {
      method: 'PATCH',
      body: JSON.stringify({ new_name: newName }),
    }),
};

// ── Research ─────────────────────────────────────────────────────────────────

export interface ResearchData {
  id: number;
  title: string;
  slug: string;
  description: string;
  methodology?: string | null;
  publication_url?: string | null;
  display_order: number;
  status: 'draft' | 'published' | 'archived';
}

export const cmsResearch = {
  listAll: () => request<ResearchData[]>('/research/admin/all'),
  create: (data: Partial<ResearchData>) =>
    request<ResearchData>('/research', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<ResearchData>) =>
    request<ResearchData>(`/research/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/research/${id}`, { method: 'DELETE' }),
};

// ── Certificates ─────────────────────────────────────────────────────────────

export interface CertificateData {
  id: number;
  name: string;
  issuer: string;
  issue_date: string;
  credential_url?: string | null;
  display_order: number;
  media_id?: number | null;
}

export const cmsCertificates = {
  listAll: () => request<CertificateData[]>('/certificates'),
  create: (data: Partial<CertificateData>) =>
    request<CertificateData>('/certificates', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<CertificateData>) =>
    request<CertificateData>(`/certificates/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/certificates/${id}`, { method: 'DELETE' }),
};

// ── Messages (Contact Inquiries) ─────────────────────────────────────────────

export interface ContactMessageData {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

export const cmsMessages = {
  listAll: () => request<ContactMessageData[]>('/contact'),
  getUnreadCount: () => request<{ unread: number }>('/contact/unread/count'),
  markRead: (id: number, read: boolean = true) =>
    request<ContactMessageData>(`/contact/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ read }),
    }),
  delete: (id: number) => request<void>(`/contact/${id}`, { method: 'DELETE' }),
};

// ── Settings ─────────────────────────────────────────────────────────────────

export interface SettingData {
  id: number;
  key: string;
  value: string;
  description?: string | null;
}

export const cmsSettings = {
  listAll: () => request<SettingData[]>('/settings'),
  upsert: (key: string, value: string, description?: string | null) =>
    request<SettingData>(`/settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ value, description }),
    }),
  delete: (key: string) => request<void>(`/settings/${key}`, { method: 'DELETE' }),
};

// ── Media Management ─────────────────────────────────────────────────────────

export interface MediaData {
  id: number;
  filename: string;
  file_path: string;
  url: string;
  mime_type: string;
  file_size_bytes: number;
  alt_text?: string | null;
  created_at: string;
}

export interface MediaListData {
  total: number;
  items: MediaData[];
}

export const cmsMedia = {
  list: (skip: number = 0, limit: number = 50) =>
    request<MediaListData>(`/media?skip=${skip}&limit=${limit}`),
  getMetadata: (id: number) => request<MediaData>(`/media/${id}`),
  upload: async (file: File, altText?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (altText) {
      formData.append('alt_text', altText);
    }
    return request<MediaData>('/media/upload', {
      method: 'POST',
      body: formData,
    });
  },
  updateAltText: (id: number, altText: string) =>
    request<MediaData>(`/media/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ alt_text: altText }),
    }),
  delete: (id: number) => request<void>(`/media/${id}`, { method: 'DELETE' }),
};


