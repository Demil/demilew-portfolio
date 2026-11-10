'use client';

import React, { useEffect, useState } from 'react';
import {
  Settings,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Sliders,
  Globe,
  Mail,
  ShieldAlert,
} from 'lucide-react';
import { cmsSettings, SettingData } from '@/lib/cms-api';

interface PresetSetting {
  key: string;
  label: string;
  description: string;
  placeholder: string;
  type?: 'text' | 'textarea' | 'select';
  options?: { label: string; value: string }[];
}

const COMMON_PRESETS: PresetSetting[] = [
  {
    key: 'site_title',
    label: 'Site Title',
    description: 'The primary title displayed in browser tabs and search engine results.',
    placeholder: 'Demilew Terefe — AI & Backend Engineer',
  },
  {
    key: 'site_tagline',
    label: 'Site Tagline / Headline',
    description: 'A concise summary shown on the hero section and SEO meta tags.',
    placeholder: 'AI & Backend Engineer specializing in scalable architectures and applied AI.',
  },
  {
    key: 'meta_description',
    label: 'Meta Description',
    description: 'Search engine description snippet for SEO preview.',
    placeholder: 'Demilew Terefe - Full-Stack AI Engineer, Researcher, and Distributed Systems Builder.',
    type: 'textarea',
  },
  {
    key: 'contact_email',
    label: 'Contact Inquiries Email',
    description: 'The public email address visitors and recruiters reach out to.',
    placeholder: 'contact@demilewterefe.com',
  },
  {
    key: 'availability_status',
    label: 'Availability Status',
    description: 'Displays current work availability banner across the portfolio.',
    placeholder: 'Available for full-time engineering roles & research collaborations',
  },
  {
    key: 'maintenance_mode',
    label: 'Maintenance Mode',
    description: 'Whether to show maintenance overlay for non-admin visitors.',
    placeholder: 'false',
    type: 'select',
    options: [
      { label: 'Disabled (Site is Live)', value: 'false' },
      { label: 'Enabled (Site Under Maintenance)', value: 'true' },
    ],
  },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Quick form for common settings
  const [presetValues, setPresetValues] = useState<Record<string, string>>({});
  const [savingPreset, setSavingPreset] = useState<string | null>(null);

  // Custom setting modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [customKey, setCustomKey] = useState('');
  const [customValue, setCustomValue] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [savingModal, setSavingModal] = useState(false);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await cmsSettings.listAll();
      setSettings(data);

      const mapping: Record<string, string> = {};
      data.forEach((s) => {
        mapping[s.key] = s.value;
      });
      setPresetValues(mapping);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSavePreset = async (key: string, description: string) => {
    setSavingPreset(key);
    setError(null);
    setSuccessMsg(null);

    try {
      const val = presetValues[key] ?? '';
      await cmsSettings.upsert(key, val, description);
      setSuccessMsg(`Setting "${key}" saved successfully.`);
      await loadSettings();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setSavingPreset(null);
    }
  };

  const openCreateModal = () => {
    setEditingKey(null);
    setCustomKey('');
    setCustomValue('');
    setCustomDescription('');
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: SettingData) => {
    setEditingKey(item.key);
    setCustomKey(item.key);
    setCustomValue(item.value);
    setCustomDescription(item.description || '');
    setError(null);
    setIsModalOpen(true);
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingModal(true);
    setError(null);

    try {
      const keyToUse = editingKey || customKey.trim().toLowerCase().replace(/\s+/g, '_');
      await cmsSettings.upsert(keyToUse, customValue, customDescription || null);
      setSuccessMsg(`Setting "${keyToUse}" saved.`);
      setIsModalOpen(false);
      await loadSettings();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setSavingModal(false);
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm(`Are you sure you want to delete setting "${key}"?`)) return;
    try {
      await cmsSettings.delete(key);
      setSuccessMsg(`Setting "${key}" removed.`);
      await loadSettings();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  // Identify custom settings (not in preset keys)
  const presetKeySet = new Set(COMMON_PRESETS.map((p) => p.key));
  const customSettings = settings.filter((s) => !presetKeySet.has(s.key));

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-sky-400" /> Site Settings & Configuration
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Configure global website metadata, contact routing, and custom site-wide parameters.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-medium rounded-lg transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Custom Setting
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-red-950/40 border border-red-800/80 rounded-xl text-red-200 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800/80 rounded-xl text-emerald-200 text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Standard Site Configuration Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-zinc-300 font-semibold text-base">
          <Globe className="w-5 h-5 text-sky-400" /> Core Site Settings
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COMMON_PRESETS.map((preset) => {
            const isSaving = savingPreset === preset.key;
            return (
              <div
                key={preset.key}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-zinc-200">
                      {preset.label}
                    </label>
                    <span className="text-xs font-mono text-zinc-500">{preset.key}</span>
                  </div>
                  <p className="text-xs text-zinc-400">{preset.description}</p>

                  <div className="pt-2">
                    {preset.type === 'textarea' ? (
                      <textarea
                        rows={3}
                        value={presetValues[preset.key] ?? ''}
                        onChange={(e) =>
                          setPresetValues({ ...presetValues, [preset.key]: e.target.value })
                        }
                        placeholder={preset.placeholder}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-sky-500 transition-colors"
                      />
                    ) : preset.type === 'select' ? (
                      <select
                        value={presetValues[preset.key] ?? 'false'}
                        onChange={(e) =>
                          setPresetValues({ ...presetValues, [preset.key]: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-sky-500 transition-colors"
                      >
                        {preset.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={presetValues[preset.key] ?? ''}
                        onChange={(e) =>
                          setPresetValues({ ...presetValues, [preset.key]: e.target.value })
                        }
                        placeholder={preset.placeholder}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-sky-500 transition-colors"
                      />
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex justify-end">
                  <button
                    onClick={() => handleSavePreset(preset.key, preset.description)}
                    disabled={isSaving}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom & Advanced Key-Value Settings */}
      <div className="space-y-4 pt-6 border-t border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-300 font-semibold text-base">
            <Sliders className="w-5 h-5 text-sky-400" /> Custom Key-Value Parameters
          </div>
          <span className="text-xs text-zinc-500">
            {customSettings.length} custom {customSettings.length === 1 ? 'parameter' : 'parameters'}
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-zinc-400 text-sm">Loading settings...</div>
        ) : customSettings.length === 0 ? (
          <div className="p-8 text-center bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 text-sm">
            No custom key-value pairs configured. Click &quot;Add Custom Setting&quot; to define custom configuration entries.
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-800">
            {customSettings.map((item) => (
              <div key={item.key} className="p-4 flex items-center justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold text-sky-400">{item.key}</span>
                    {item.description && (
                      <span className="text-xs text-zinc-400 truncate max-w-md">
                        — {item.description}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-200 font-mono bg-zinc-950 px-3 py-1.5 rounded border border-zinc-800 max-w-xl break-all">
                    {item.value}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                    title="Edit Setting"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.key)}
                    className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors"
                    title="Delete Setting"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Custom Setting */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-4">
              {editingKey ? `Edit Setting: ${editingKey}` : 'Add Custom Setting'}
            </h2>

            <form onSubmit={handleCustomSubmit} className="space-y-4">
              {!editingKey && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    Key *
                  </label>
                  <input
                    type="text"
                    required
                    value={customKey}
                    onChange={(e) => setCustomKey(e.target.value)}
                    placeholder="e.g. analytics_id, github_stars_target"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-sky-500"
                  />
                  <p className="text-xs text-zinc-500 mt-1">Lowercase alphanumeric with underscores.</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Value *
                </label>
                <textarea
                  required
                  rows={3}
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  placeholder="Setting value string..."
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="Optional brief description of this parameter"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingModal}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {savingModal ? 'Saving...' : 'Save Setting'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

