export interface AdminUser {
  id: number;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SetupStatus {
  is_initialized: boolean;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

export function getCsrfToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )csrf_token=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export async function getSetupStatus(): Promise<SetupStatus> {
  const res = await fetch(`${API_BASE_URL}/auth/setup-status`, {
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch setup status');
  }
  return res.json();
}

export async function setupInitialAdmin(email: string, password: string): Promise<AdminUser> {
  const res = await fetch(`${API_BASE_URL}/auth/setup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to initialize administrator account');
  }
  return res.json();
}

export async function loginAdmin(email: string, password: string): Promise<{ access_token: string; user: AdminUser }> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Login failed. Please check your credentials.');
  }
  return res.json();
}

export async function getMe(): Promise<AdminUser | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      credentials: 'include',
    });
    if (!res.ok) {
      return null;
    }
    return res.json();
  } catch {
    return null;
  }
}

export async function logoutAdmin(): Promise<void> {
  await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  }).catch(() => {});
}

