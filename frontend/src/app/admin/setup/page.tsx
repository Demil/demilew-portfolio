'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, Mail, ShieldAlert, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { getSetupStatus } from '@/lib/auth';

export default function AdminSetupPage() {
  const router = useRouter();
  const { setup } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [checking, setChecking] = useState(true);
  const [alreadyInit, setAlreadyInit] = useState(false);

  useEffect(() => {
    getSetupStatus()
      .then((status) => {
        if (status.is_initialized) {
          setAlreadyInit(true);
        }
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters in length');
      return;
    }

    setSubmitting(true);
    try {
      await setup(email, password);
      router.push('/admin');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Setup failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center text-slate-400">
        Verifying system initialization state...
      </div>
    );
  }

  if (alreadyInit) {
    return (
      <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md bg-[#111827] border border-slate-800 p-8 rounded-2xl text-center">
          <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white">Platform Already Initialized</h2>
          <p className="mt-2 text-sm text-slate-400">
            An administrator account has already been registered. Public setup is permanently locked.
          </p>
          <Link
            href="/admin/login"
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 transition-colors"
          >
            Go to Admin Login <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 mb-4 shadow-[0_0_20px_rgba(20,184,166,0.15)]">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Initial Platform Setup</h2>
        <p className="mt-2 text-sm text-slate-400">
          Provision the master administrator identity for Demilew Terefe CMS
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#111827] border border-slate-800 py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 text-sm flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="setup-email" className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                Administrator Email
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="setup-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-colors"
                  placeholder="demilew@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="setup-pass" className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                Master Password (min 8 characters)
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="setup-pass"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-colors"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div>
              <label htmlFor="setup-confirm" className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                Confirm Password
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="setup-confirm"
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-colors"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {submitting ? 'Initializing Platform...' : 'Complete First-Run Setup'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800/80 text-center">
            <Link
              href="/admin/login"
              className="text-xs text-slate-400 hover:text-cyan-400 transition-colors inline-flex items-center gap-1.5"
            >
              Already initialized? Proceed to Sign In →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

