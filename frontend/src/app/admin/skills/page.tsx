'use client';

import React, { useEffect, useState } from 'react';
import { Wrench, Plus, Edit2, Trash2, Save, X, AlertCircle, FolderPlus } from 'lucide-react';
import { cmsSkills, SkillData } from '@/lib/cms-api';
import { StatusBadge } from '@/components/admin/StatusBadge';

const DEFAULT_CATEGORIES = ['Backend', 'Frontend', 'DevOps', 'Other'];

export default function AdminSkillsPage() {
  const [items, setItems] = useState<SkillData[]>([]);
  const [customCategories, setCustomCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Skill Modal
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState<number | null>(null);
  const [savingSkill, setSavingSkill] = useState(false);
  const [skillName, setSkillName] = useState('');
  const [skillCategory, setSkillCategory] = useState('Backend');
  const [skillDisplayOrder, setSkillDisplayOrder] = useState(0);
  const [skillStatus, setSkillStatus] = useState<'draft' | 'published' | 'archived'>('published');

  // Category Modal (Add Card)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryInitialSkill, setNewCategoryInitialSkill] = useState('');

  // Category Rename Modal
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [categoryToRename, setCategoryToRename] = useState('');
  const [renamedCategoryName, setRenamedCategoryName] = useState('');
  const [renaming, setRenaming] = useState(false);

  // Delete Category Modal
  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState('');
  const [deletingCategory, setDeletingCategory] = useState(false);

  // Load custom categories from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('demilew_custom_skill_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCustomCategories(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const saveCustomCategories = (cats: string[]) => {
    setCustomCategories(cats);
    try {
      localStorage.setItem('demilew_custom_skill_categories', JSON.stringify(cats));
    } catch {
      // ignore
    }
  };

  const loadSkills = async () => {
    try {
      setLoading(true);
      const data = await cmsSkills.listAll();
      setItems(data);

      // Merge backend categories with existing list
      const fromBackend = Array.from(new Set(data.map((s) => s.category)));
      setCustomCategories((prev) => {
        const merged = Array.from(new Set([...prev, ...fromBackend]));
        try {
          localStorage.setItem('demilew_custom_skill_categories', JSON.stringify(merged));
        } catch {
          // ignore
        }
        return merged;
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  // Compute all categories to display (union of custom and active)
  const allCategories = Array.from(new Set([...customCategories, ...items.map((s) => s.category)]));

  // --- Handlers: Skill ---
  const openCreateSkillModal = (defaultCat?: string) => {
    setEditingSkillId(null);
    setSkillName('');
    setSkillCategory(defaultCat || allCategories[0] || 'Backend');
    setSkillDisplayOrder(items.length);
    setSkillStatus('published');
    setError(null);
    setIsSkillModalOpen(true);
  };

  const openEditSkillModal = (item: SkillData) => {
    setEditingSkillId(item.id);
    setSkillName(item.name);
    setSkillCategory(item.category);
    setSkillDisplayOrder(item.display_order);
    setSkillStatus(item.status);
    setError(null);
    setIsSkillModalOpen(true);
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim() || !skillCategory.trim()) return;

    setSavingSkill(true);
    setError(null);

    const payload = {
      name: skillName.trim(),
      category: skillCategory.trim(),
      display_order: Number(skillDisplayOrder),
      status: skillStatus,
    };

    try {
      if (editingSkillId) {
        await cmsSkills.update(editingSkillId, payload);
      } else {
        await cmsSkills.create(payload);
      }
      if (!customCategories.includes(payload.category)) {
        saveCustomCategories([...customCategories, payload.category]);
      }
      setIsSkillModalOpen(false);
      await loadSkills();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setSavingSkill(false);
    }
  };

  const handleDeleteSkill = async (id: number) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      await cmsSkills.delete(id);
      await loadSkills();
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      }
    }
  };

  // --- Handlers: Category Cards ---
  const handleCreateCategoryCard = async (e: React.FormEvent) => {
    e.preventDefault();
    const cat = newCategoryName.trim();
    if (!cat) return;

    if (allCategories.some((c) => c.toLowerCase() === cat.toLowerCase())) {
      alert(`Category card "${cat}" already exists.`);
      return;
    }

    const updated = [...customCategories, cat];
    saveCustomCategories(updated);

    if (newCategoryInitialSkill.trim()) {
      try {
        await cmsSkills.create({
          name: newCategoryInitialSkill.trim(),
          category: cat,
          display_order: 1,
          status: 'published',
        });
      } catch (err) {
        console.error('Error creating initial skill:', err);
      }
    }

    setIsCategoryModalOpen(false);
    setNewCategoryName('');
    setNewCategoryInitialSkill('');
    await loadSkills();
  };

  const openRenameCategoryModal = (cat: string) => {
    setCategoryToRename(cat);
    setRenamedCategoryName(cat);
    setIsRenameModalOpen(true);
  };

  const handleRenameCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const oldName = categoryToRename;
    const newName = renamedCategoryName.trim();
    if (!newName || newName === oldName) {
      setIsRenameModalOpen(false);
      return;
    }

    setRenaming(true);
    try {
      await cmsSkills.renameCategory(oldName, newName);
      const updated = customCategories.map((c) => (c === oldName ? newName : c));
      saveCustomCategories(updated);
      setIsRenameModalOpen(false);
      await loadSkills();
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      }
    } finally {
      setRenaming(false);
    }
  };

  const openDeleteCategoryModal = (cat: string) => {
    setCategoryToDelete(cat);
    setIsDeleteCategoryModalOpen(true);
  };

  const handleDeleteCategory = async () => {
    const cat = categoryToDelete;
    if (!cat) return;

    setDeletingCategory(true);
    try {
      await cmsSkills.deleteCategory(cat);
      const updated = customCategories.filter((c) => c !== cat);
      saveCustomCategories(updated);
      setIsDeleteCategoryModalOpen(false);
      setCategoryToDelete('');
      await loadSkills();
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      }
    } finally {
      setDeletingCategory(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[var(--accent-primary)] text-xs font-mono mb-1">
            <Wrench className="w-4 h-4" />
            <span>Technical Capabilities</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Skills &amp; Domain Categories</h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Manage your engineering disciplines dynamically. Add or delete full skill category cards (e.g. Backend, Frontend, Mobile, AI) and sub-skills.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-muted)] text-[var(--text-primary)] border border-[var(--border-prominent)] font-medium text-xs transition-all shadow-xs"
          >
            <FolderPlus className="w-4 h-4 text-[var(--accent-primary)]" />
            <span>+ Add Skill Card</span>
          </button>

          <button
            onClick={() => openCreateSkillModal()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white font-medium text-xs shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Skill</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="py-12 text-center text-xs font-mono text-[var(--text-tertiary)]">
          Loading capability directory...
        </div>
      )}

      {/* Dynamic Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allCategories.map((cat) => {
          const categorySkills = items.filter((s) => s.category.toLowerCase() === cat.toLowerCase());
          return (
            <div
              key={cat}
              className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-prominent)] flex flex-col transition-all shadow-sm"
            >
              {/* Category Card Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-primary)] shadow-xs" />
                  <h2 className="text-sm font-bold text-[var(--text-primary)] tracking-wide font-mono">
                    {cat}
                  </h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-surface-elevated)] text-[var(--text-tertiary)] font-mono">
                    {categorySkills.length} skills
                  </span>
                </div>

                {/* Card Controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openCreateSkillModal(cat)}
                    className="p-1.5 rounded-md text-[var(--accent-primary)] hover:bg-[var(--accent-subtle)] transition-colors"
                    title={`Add skill to ${cat}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => openRenameCategoryModal(cat)}
                    className="p-1.5 rounded-md text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors"
                    title={`Rename ${cat} Card`}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => openDeleteCategoryModal(cat)}
                    className="p-1.5 rounded-md text-[var(--text-tertiary)] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title={`Delete entire ${cat} Card`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Skills List inside this Card */}
              <div className="space-y-2 flex-1">
                {categorySkills.length === 0 ? (
                  <div className="py-6 text-center">
                    <p className="text-xs text-[var(--text-tertiary)] italic mb-2">No skills in this category card yet.</p>
                    <button
                      onClick={() => openCreateSkillModal(cat)}
                      className="text-xs text-[var(--accent-primary)] hover:underline font-mono inline-flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add first skill
                    </button>
                  </div>
                ) : (
                  categorySkills.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs hover:border-[var(--border-prominent)] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[var(--text-primary)]">{s.name}</span>
                        <StatusBadge status={s.status} />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-[var(--text-tertiary)]">#{s.display_order}</span>
                        <button
                          onClick={() => openEditSkillModal(s)}
                          className="p-1 rounded text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSkill(s.id)}
                          className="p-1 rounded text-[var(--text-tertiary)] hover:text-rose-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal 1: Add or Edit Individual Skill */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-prominent)] rounded-xl w-full max-w-md p-6 shadow-xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
              <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[var(--accent-primary)]" />
                <span>{editingSkillId ? 'Edit Technical Skill' : 'Add Technical Skill'}</span>
              </h2>
              <button onClick={() => setIsSkillModalOpen(false)} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg-base)] border border-[var(--border-prominent)] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  placeholder="E.g. Python, PyTorch, Docker, Flutter"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Category Card *</label>
                <select
                  value={skillCategory}
                  onChange={(e) => setSkillCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg-base)] border border-[var(--border-prominent)] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                >
                  {allCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Display Order</label>
                  <input
                    type="number"
                    min={0}
                    value={skillDisplayOrder}
                    onChange={(e) => setSkillDisplayOrder(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-[var(--bg-base)] border border-[var(--border-prominent)] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Status</label>
                  <select
                    value={skillStatus}
                    onChange={(e) => setSkillStatus(e.target.value as 'draft' | 'published' | 'archived')}
                    className="w-full px-3 py-2 bg-[var(--bg-base)] border border-[var(--border-prominent)] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSkillModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[var(--border-prominent)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-muted)] text-[var(--text-secondary)] text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingSkill}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white text-xs font-medium shadow-xs disabled:opacity-50 transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingSkill ? 'Saving...' : 'Save Skill'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Add Category Card */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-prominent)] rounded-xl w-full max-w-md p-6 shadow-xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
              <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-[var(--accent-primary)]" />
                <span>Add Skill Category Card</span>
              </h2>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategoryCard} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Category Card Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg-base)] border border-[var(--border-prominent)] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  placeholder="E.g. Mobile Engineering, AI & Deep Learning, Cloud & DevOps"
                />
                <p className="text-[11px] text-[var(--text-tertiary)] mt-1">
                  This card will appear on both your admin dashboard and public portfolio skills section.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  First Skill (Optional)
                </label>
                <input
                  type="text"
                  value={newCategoryInitialSkill}
                  onChange={(e) => setNewCategoryInitialSkill(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg-base)] border border-[var(--border-prominent)] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  placeholder="E.g. Flutter, Swift, Kubernetes"
                />
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[var(--border-prominent)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-muted)] text-[var(--text-secondary)] text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white text-xs font-medium shadow-xs transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Card</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Rename Category Card */}
      {isRenameModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-prominent)] rounded-xl w-full max-w-md p-6 shadow-xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
              <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[var(--accent-primary)]" />
                <span>Rename Category Card</span>
              </h2>
              <button onClick={() => setIsRenameModalOpen(false)} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRenameCategory} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Rename &ldquo;{categoryToRename}&rdquo; to:
                </label>
                <input
                  type="text"
                  required
                  value={renamedCategoryName}
                  onChange={(e) => setRenamedCategoryName(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg-base)] border border-[var(--border-prominent)] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRenameModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[var(--border-prominent)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-muted)] text-[var(--text-secondary)] text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={renaming}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white text-xs font-medium shadow-xs disabled:opacity-50 transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{renaming ? 'Renaming...' : 'Rename Card'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Delete Category Card Confirmation */}
      {isDeleteCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[var(--bg-surface)] border border-rose-500/30 rounded-xl w-full max-w-md p-6 shadow-xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
              <h2 className="text-base font-bold text-rose-400 flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-400" />
                <span>Delete Skill Category Card</span>
              </h2>
              <button onClick={() => setIsDeleteCategoryModalOpen(false)} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Are you sure you want to delete the <span className="font-bold text-[var(--text-primary)]">&ldquo;{categoryToDelete}&rdquo;</span> category card and all <span className="text-rose-400 font-bold">{items.filter((s) => s.category.toLowerCase() === categoryToDelete.toLowerCase()).length} skills</span> inside it?
              </p>
              <p className="text-[11px] text-rose-400/80">
                This action is irreversible. The card will be permanently removed from your portfolio.
              </p>
            </div>

            <div className="pt-6 border-t border-[var(--border-subtle)] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteCategoryModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-[var(--border-prominent)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-muted)] text-[var(--text-secondary)] text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCategory}
                disabled={deletingCategory}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium shadow-xs disabled:opacity-50 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{deletingCategory ? 'Deleting...' : 'Confirm Delete Card'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
