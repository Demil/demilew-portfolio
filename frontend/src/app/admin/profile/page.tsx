'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  User,
  Plus,
  Trash2,
  Save,
  Globe,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  Download,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { cmsProfile, ProfileData, SocialLinkData } from '@/lib/cms-api';

interface CvMeta {
  id: number;
  filename: string;
  file_size_bytes: number;
  mime_type: string;
  url: string;
  uploaded_at: string;
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [cvMeta, setCvMeta] = useState<CvMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // CV state
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [deletingCv, setDeletingCv] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // New social link form
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const loadProfileAndCv = async () => {
    try {
      setLoading(true);
      const [profileData, cvData] = await Promise.all([
        cmsProfile.getAdmin(),
        cmsProfile.getCv().catch(() => null),
      ]);
      setProfile(profileData);
      setCvMeta(cvData);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMsg({ type: 'error', text: err.message });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileAndCv();
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setMsg(null);
    try {
      const updated = await cmsProfile.update({
        full_name: profile.full_name,
        headline: profile.headline,
        biography: profile.biography,
        location: profile.location,
        email: profile.email,
      });
      setProfile(updated);
      setMsg({ type: 'success', text: 'Profile details saved successfully.' });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMsg({ type: 'error', text: err.message });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setMsg({ type: 'error', text: 'Only PDF documents are supported for CV upload.' });
      return;
    }
    setCvFile(file);
    setMsg(null);
  };

  const handleUploadCv = async () => {
    if (!cvFile) return;
    setUploadingCv(true);
    setMsg(null);
    try {
      await cmsProfile.uploadCv(cvFile);
      setCvFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setMsg({ type: 'success', text: 'Curriculum Vitae uploaded and published successfully.' });
      const refreshedCv = await cmsProfile.getCv().catch(() => null);
      setCvMeta(refreshedCv);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMsg({ type: 'error', text: err.message });
      }
    } finally {
      setUploadingCv(false);
    }
  };

  const handleDeleteCv = async () => {
    if (!confirm('Are you sure you want to remove the current CV? Visitors will no longer see the CV download option.')) {
      return;
    }
    setDeletingCv(true);
    setMsg(null);
    try {
      await cmsProfile.deleteCv();
      setCvMeta(null);
      setMsg({ type: 'success', text: 'Curriculum Vitae removed successfully.' });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMsg({ type: 'error', text: err.message });
      }
    } finally {
      setDeletingCv(false);
    }
  };

  const handleAddSocialLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlatform || !newUrl) return;
    try {
      await cmsProfile.addSocialLink({
        platform: newPlatform,
        url: newUrl,
        display_order: profile?.social_links.length || 0,
        is_visible: true,
      });
      setNewPlatform('');
      setNewUrl('');
      loadProfileAndCv();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMsg({ type: 'error', text: err.message });
      }
    }
  };

  const handleToggleVisibility = async (link: SocialLinkData) => {
    try {
      await cmsProfile.updateSocialLink(link.id, { is_visible: !link.is_visible });
      loadProfileAndCv();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMsg({ type: 'error', text: err.message });
      }
    }
  };

  const handleDeleteSocialLink = async (id: number) => {
    if (!confirm('Remove this social link?')) return;
    try {
      await cmsProfile.deleteSocialLink(id);
      loadProfileAndCv();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMsg({ type: 'error', text: err.message });
      }
    }
  };

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
          Profile &amp; Credentials Configuration
        </h1>
        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          Manage your executive headline, biography, curriculum vitae (CV), and social channels.
        </p>
      </div>

      {/* Status Feedback */}
      {msg && (
        <div
          className={`p-4 rounded-xl text-xs flex items-start gap-3 border ${msg.type === 'success'
            ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
            : 'bg-rose-950/30 border-rose-800/40 text-rose-300'
            }`}
        >
          {msg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          )}
          <span>{msg.text}</span>
        </div>
      )}

      {/* ── Curriculum Vitae (CV) Management Card ────────────────────────── */}
      <div className="p-6 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] text-[var(--accent-primary)]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">Curriculum Vitae (CV)</h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Upload your latest PDF CV for public viewing and direct download.
              </p>
            </div>
          </div>
          {cvMeta && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Active CV Published
            </span>
          )}
        </div>

        {/* Existing CV details */}
        {cvMeta ? (
          <div className="p-4 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[var(--text-primary)] truncate font-mono">
                    {cvMeta.filename}
                  </span>
                  <span className="text-[11px] text-[var(--text-tertiary)] font-mono">
                    ({Math.round(cvMeta.file_size_bytes / 1024)} KB)
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-tertiary)] font-mono">
                  Uploaded: {new Date(cvMeta.uploaded_at).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`${apiBase}/profile/cv/download`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-prominent)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] text-xs font-medium transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                  <span>View PDF</span>
                </a>
                <a
                  href={`${apiBase}/profile/cv/download?download=1`}
                  download={cvMeta.filename}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-prominent)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-medium transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button
                  type="button"
                  onClick={handleDeleteCv}
                  disabled={deletingCv}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-medium transition-colors disabled:opacity-50"
                  title="Remove CV"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{deletingCv ? 'Removing...' : 'Delete'}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-[var(--bg-base)] border border-dashed border-[var(--border-prominent)] text-center text-xs text-[var(--text-tertiary)]">
            No CV document is currently uploaded. Upload a PDF below to make your CV available to site visitors.
          </div>
        )}

        {/* Upload form */}
        <div className="space-y-3 pt-1">
          <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
            {cvMeta ? 'Replace Existing CV' : 'Upload New CV Document (.pdf)'}
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleCvFileChange}
              className="text-xs text-[var(--text-secondary)] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border file:border-[var(--border-subtle)] file:bg-[var(--bg-base)] file:text-[var(--text-primary)] file:text-xs file:font-medium hover:file:border-[var(--border-prominent)] cursor-pointer"
            />
            <button
              type="button"
              onClick={handleUploadCv}
              disabled={!cvFile || uploadingCv}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm shrink-0"
            >
              {uploadingCv ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              <span>{uploadingCv ? 'Uploading...' : 'Publish CV'}</span>
            </button>
          </div>
          {cvFile && (
            <p className="text-[11px] text-[var(--accent-primary)] font-mono">
              Selected file: {cvFile.name} ({Math.round(cvFile.size / 1024)} KB)
            </p>
          )}
        </div>
      </div>

      {/* ── Primary Profile Information ───────────────────────────────────── */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[var(--text-secondary)] font-mono">
          Loading profile parameters...
        </div>
      ) : (
        profile && (
          <form
            onSubmit={handleProfileSubmit}
            className="p-6 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-5"
          >
            <div className="pb-3 border-b border-[var(--border-subtle)]">
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">Public Dossier Information</h2>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                These fields populate the hero narrative and credentials card on the homepage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-primary)] placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                  Public Contact Email
                </label>
                <input
                  type="email"
                  required
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-primary)] placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Professional Headline
              </label>
              <input
                type="text"
                required
                value={profile.headline}
                onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-primary)] placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Location
              </label>
              <input
                type="text"
                required
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-primary)] placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Biography &amp; Narrative
              </label>
              <textarea
                rows={5}
                required
                value={profile.biography}
                onChange={(e) => setProfile({ ...profile, biography: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-primary)] placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors leading-relaxed"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-sm disabled:opacity-50 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        )
      )}

      {/* ── Social Profiles ─────────────────────────────────────────────────── */}
      <div className="p-6 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-500" />
            <span>Verified Social Profiles</span>
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Links displayed in the footer and hero header. Toggle visibility or append new platforms.
          </p>
        </div>

        {/* Existing Links List */}
        <div className="space-y-2">
          {profile?.social_links.length === 0 ? (
            <p className="text-xs text-[var(--text-tertiary)] italic py-2">No social links added yet.</p>
          ) : (
            profile?.social_links.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-semibold text-[var(--text-primary)]">{link.platform}</span>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--accent-primary)] hover:underline font-mono truncate max-w-xs"
                  >
                    {link.url}
                  </a>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleVisibility(link)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono font-medium border transition-colors ${link.is_visible
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-[var(--bg-surface)] text-[var(--text-tertiary)] border-[var(--border-subtle)]'
                      }`}
                  >
                    {link.is_visible ? 'Visible' : 'Hidden'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteSocialLink(link.id)}
                    className="text-[var(--text-tertiary)] hover:text-rose-400 transition-colors p-1"
                    title="Delete link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Link Form */}
        <form onSubmit={handleAddSocialLink} className="pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            placeholder="Platform (e.g. GitHub, LinkedIn)"
            value={newPlatform}
            onChange={(e) => setNewPlatform(e.target.value)}
            className="flex-1 px-3.5 py-2 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg text-xs text-[var(--text-primary)] placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <input
            type="url"
            required
            placeholder="URL (https://...)"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className="flex-1 px-3.5 py-2 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg text-xs text-[var(--text-primary)] placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Link</span>
          </button>
        </form>
      </div>
    </div>
  );
}
