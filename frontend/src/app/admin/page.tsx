'use client';

import React from 'react';
import Link from 'next/link';
import {
  FolderGit2,
  Wrench,
  Briefcase,
  MessageSquare,
  ArrowUpRight,
  Database,
  Lock,
  PlusCircle,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export default function AdminDashboardPage() {
  const { admin } = useAuth();

  const metrics = [
    {
      title: 'Portfolio Projects',
      count: '3',
      subtext: 'Published Case Studies',
      href: '/admin/projects',
      icon: FolderGit2,
      accent: 'text-blue-500',
    },
    {
      title: 'Technical Skills',
      count: '13',
      subtext: 'Configured Skill Cards',
      href: '/admin/skills',
      icon: Wrench,
      accent: 'text-emerald-500',
    },
    {
      title: 'Experience Items',
      count: '3',
      subtext: 'Verified Industry Positions',
      href: '/admin/experience',
      icon: Briefcase,
      accent: 'text-indigo-500',
    },
    {
      title: 'Inbound Inquiries',
      count: 'Active',
      subtext: 'Consultation Desk',
      href: '/admin/messages',
      icon: MessageSquare,
      accent: 'text-amber-500',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* ── Welcome Banner ─────────────────────────────────────────────────── */}
      <div className="p-6 md:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 dark:text-blue-400 text-xs font-mono mb-4">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Administrator Session Verified</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            Welcome back, {admin?.email ? admin.email.split('@')[0] : 'Administrator'}
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            Manage portfolio projects, technical skills, publications, and administrative
            configurations from this central dashboard. All modifications publish immediately to
            the live website.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/admin/projects"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Manage Projects</span>
            </Link>
            <Link
              href="/admin/skills"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium text-xs hover:border-[var(--border-prominent)] transition-colors"
            >
              <span>Manage Skills</span>
            </Link>
            <Link
              href="/admin/messages"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium text-xs hover:border-[var(--border-prominent)] transition-colors"
            >
              <span>Review Messages</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Metric Cards ───────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-4 font-semibold">
          Portfolio Content Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.title}
                href={m.href}
                className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-prominent)] transition-all group relative block"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] ${m.accent}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors" />
                </div>
                <div className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">{m.count}</div>
                <div className="text-xs font-semibold text-[var(--text-primary)] mt-1">{m.title}</div>
                <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">{m.subtext}</div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Architecture & Security Status ──────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center gap-2.5 mb-4 text-blue-500">
            <Database className="w-5 h-5" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Database & Relational State</h3>
          </div>
          <div className="space-y-3 text-xs font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <span className="text-[var(--text-secondary)]">Database Engine</span>
              <span className="text-[var(--text-primary)] font-medium">PostgreSQL 16 (Docker)</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <span className="text-[var(--text-secondary)]">ORM Architecture</span>
              <span className="text-[var(--text-primary)] font-medium">SQLAlchemy 2.0 (Strict Types)</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <span className="text-[var(--text-secondary)]">Active Tables</span>
              <span className="text-[var(--text-primary)] font-medium">14 Registered Relations</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">Schema Migrations</span>
              <span className="text-emerald-500 font-medium">Alembic Linear Revision (Head)</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center gap-2.5 mb-4 text-indigo-500">
            <Lock className="w-5 h-5" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Security & Session Guard</h3>
          </div>
          <div className="space-y-3 text-xs font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <span className="text-[var(--text-secondary)]">Password Hashing</span>
              <span className="text-[var(--text-primary)] font-medium">Argon2id (RFC 9106)</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <span className="text-[var(--text-secondary)]">Session Transport</span>
              <span className="text-[var(--text-primary)] font-medium">HTTP-Only Cookies (SameSite=Lax)</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <span className="text-[var(--text-secondary)]">Mutation CSRF</span>
              <span className="text-[var(--text-primary)] font-medium">Double-Submit Header Validation</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">Login Protection</span>
              <span className="text-emerald-500 font-medium">Rate Limiter (5 attempts / 60s)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
