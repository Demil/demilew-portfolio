'use client';

import React, { useEffect, useState } from 'react';
import { BookOpen, Plus, Edit2, Trash2, Save, X, ExternalLink, AlertCircle } from 'lucide-react';
import { cmsResearch, ResearchData } from '@/lib/cms-api';
import { StatusBadge } from '@/components/admin/StatusBadge';

export default function AdminResearchPage() {
  const [items, setItems] = useState<ResearchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [methodology, setMethodology] = useState('');
  const [publicationUrl, setPublicationUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');

  const loadResearch = async () => {
    try {
      setLoading(true);
      const data = await cmsResearch.listAll();
      setItems(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResearch();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setDescription('');
    setMethodology('');
    setPublicationUrl('');
    setDisplayOrder(items.length);
    setStatus('draft');
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: ResearchData) => {
    setEditingId(item.id);
    setTitle(item.title);
    setSlug(item.slug);
    setDescription(item.description);
    setMethodology(item.methodology || '');
    setPublicationUrl(item.publication_url || '');
    setDisplayOrder(item.display_order);
    setStatus(item.status);
    setError(null);
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingId) {
      const genSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(genSlug);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      title,
      slug,
      description,
      methodology: methodology || null,
      publication_url: publicationUrl || null,
      display_order: Number(displayOrder),
      status,
    };

    try {
      if (editingId) {
        await cmsResearch.update(editingId, payload);
      } else {
        await cmsResearch.create(payload);
      }
      setIsModalOpen(false);
      loadResearch();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this research topic?')) return;
    try {
      await cmsResearch.delete(id);
      loadResearch();
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Academic & Applied Research</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Research Initiatives & Topics</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage research topics, methodologies, and publication links. Research interests remain distinct from publications.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs shadow-lg shadow-cyan-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Research Topic</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Topic Title & Slug</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Publication Link</th>
                <th className="py-3.5 px-4">Order</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    Loading research topics...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 italic">
                    No research initiatives found. Click &quot;New Research Topic&quot; to add one.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white text-sm">{item.title}</div>
                      <div className="text-slate-500 font-mono text-[11px]">{item.slug}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-3.5 px-4">
                      {item.publication_url ? (
                        <a
                          href={item.publication_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
                        >
                          <span>Paper Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-600 italic">Work in progress</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{item.display_order}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">
                {editingId ? 'Edit Research Topic' : 'New Research Initiative'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                    placeholder="E.g. Low-Resource Amharic NLP"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Slug *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                    placeholder="low-resource-amharic-nlp"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description / Abstract *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 leading-relaxed"
                  placeholder="Summary of hypotheses, experiments, and findings..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Methodology (optional)</label>
                <textarea
                  rows={2}
                  value={methodology}
                  onChange={(e) => setMethodology(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 leading-relaxed"
                  placeholder="Datasets, baseline models, statistical evaluation metrics..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Publication URL (if published)</label>
                <input
                  type="url"
                  value={publicationUrl}
                  onChange={(e) => setPublicationUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  placeholder="https://arxiv.org/..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Publishing Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'draft' | 'published' | 'archived')}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="draft">Draft (Interest / WIP)</option>
                    <option value="published">Published (Public)</option>
                    <option value="archived">Archived (Retired)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Display Order</label>
                  <input
                    type="number"
                    min={0}
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Research'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

