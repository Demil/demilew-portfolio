'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Lock, Mail, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { getSetupStatus } from '@/lib/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const { admin, login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [needsSetup, setNeedsSetup] = useState<boolean | null>(null);

  useEffect(() => {
    if (admin) {
      router.push('/admin');
    }
  }, [admin, router]);

  useEffect(() => {
    getSetupStatus()
      .then((status) => setNeedsSetup(!status.is_initialized))
      .catch(() => setNeedsSetup(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(email, password);
      router.push('/admin');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Authentication failed. Please verify your credentials.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4 shadow-sm">
          <Lock className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Demilew Terefe CMS</h2>
        <p className="mt-1.5 text-xs text-[var(--text-secondary)]">
          Private administrative authentication portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] py-8 px-6 shadow-xl rounded-2xl sm:px-10">
          {needsSetup && (
            <div className="mb-6 p-4 rounded-xl bg-blue-950/30 border border-blue-800/40 text-blue-200 text-sm">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-300">Initial Setup Required</p>
                  <p className="mt-1 text-slate-300 text-xs leading-relaxed">
                    No administrator account has been provisioned yet.
                  </p>
                  <Link
                    href="/admin/setup"
                    className="inline-flex items-center gap-1.5 mt-2.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Initialize First Administrator <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 text-sm flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Administrator Email
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-primary)] placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="demilew@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="pass" className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Password
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="pass"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-primary)] placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              {submitting ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[var(--border-subtle)] text-center">
            <Link
              href="/"
              className="text-xs text-[var(--text-secondary)] hover:text-blue-400 transition-colors inline-flex items-center gap-1.5"
            >
              ← Return to public website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

