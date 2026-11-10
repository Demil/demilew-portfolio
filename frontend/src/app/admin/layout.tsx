'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Wrench,
  BookOpen,
  Award,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  Sun,
  Moon,
} from 'lucide-react';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { useTheme } from '@/context/ThemeContext';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/profile', label: 'Profile', icon: User },
  { href: '/admin/experience', label: 'Experience', icon: Briefcase },
  { href: '/admin/education', label: 'Education', icon: GraduationCap },
  { href: '/admin/projects', label: 'Projects', icon: FolderGit2 },
  { href: '/admin/skills', label: 'Skills', icon: Wrench },
  { href: '/admin/research', label: 'Research', icon: BookOpen },
  { href: '/admin/certificates', label: 'Certificates', icon: Award },
  { href: '/admin/media', label: 'Media Library', icon: ImageIcon },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { href: '/admin/settings', label: 'Site Settings', icon: Settings },
];

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isAuthPage = pathname === '/admin/login' || pathname === '/admin/setup';

  React.useEffect(() => {
    if (!loading && !admin && !isAuthPage) {
      router.push('/admin/login');
    }
  }, [admin, loading, isAuthPage, router]);

  if (isAuthPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center text-[var(--text-secondary)]">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Verifying administrator session...</span>
        </div>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex flex-col md:flex-row transition-colors">
      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <aside className="w-full md:w-64 bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] flex flex-col shrink-0">
        <div className="h-16 px-6 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-subtle)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-primary)]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-wide text-[var(--text-primary)] block">Demilew CMS</span>
              <span className="text-[10px] text-[var(--accent-primary)] font-mono block">v1.0 • Admin</span>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[var(--accent-subtle)] text-[var(--accent-primary)] border border-[var(--border-prominent)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--accent-primary)]' : 'text-[var(--text-tertiary)]'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Public Site Link */}
        <div className="p-3 border-t border-[var(--border-subtle)]">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* ── Main Area ────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 px-6 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/80 backdrop-blur flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-[var(--text-tertiary)] font-mono">Panel</span>
            <span className="text-[var(--border-prominent)]">/</span>
            <span className="text-xs font-semibold text-[var(--text-primary)]">
              {NAV_ITEMS.find((item) =>
                item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
              )?.label || 'Administration'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              )}
            </button>

            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[11px] truncate max-w-[160px] text-[var(--text-primary)]">{admin.email}</span>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-prominent)] bg-[var(--bg-surface-elevated)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              title="End session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 md:p-8 flex-1 overflow-auto bg-[var(--bg-base)]">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}
