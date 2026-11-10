'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Image as ImageIcon,
  Upload,
  FileText,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Edit2,
  X,
  Save,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { cmsMedia, MediaData } from '@/lib/cms-api';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaData[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Upload Form State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [altText, setAltText] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit Alt Text Modal State
  const [editingItem, setEditingItem] = useState<MediaData | null>(null);
  const [editAltText, setEditAltText] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const res = await cmsMedia.list(0, 50);
      setMediaList(res.items);
      setTotal(res.total);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setError(null);

    try {
      await cmsMedia.upload(selectedFile, altText.trim() || undefined);
      setSelectedFile(null);
      setAltText('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      await loadMedia();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this media item? Any referenced images or CV links will be broken.')) {
      return;
    }

    try {
      await cmsMedia.delete(id);
      await loadMedia();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleCopyUrl = (item: MediaData) => {
    const fullUrl = `${API_BASE}/media/files/${item.file_path}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openEditModal = (item: MediaData) => {
    setEditingItem(item);
    setEditAltText(item.alt_text || '');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setSavingEdit(true);
    try {
      await cmsMedia.updateAltText(editingItem.id, editAltText);
      setEditingItem(null);
      await loadMedia();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setSavingEdit(false);
    }
  };

  const isImage = (mime: string) => mime.startsWith('image/');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-sky-400" /> Media &amp; Document Management
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Upload and manage profile photographs, project architecture diagrams, certificates, and CV documents.
          </p>
        </div>
        <div className="text-xs font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg self-start sm:self-auto">
          Total Assets: <span className="text-white font-bold">{total}</span>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-950/40 border border-red-800/80 rounded-xl text-red-200 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Zone Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Upload className="w-4 h-4 text-sky-400" /> Upload New File
        </h2>

        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              dragActive
                ? 'border-sky-500 bg-sky-950/20'
                : 'border-zinc-700 hover:border-zinc-500 bg-zinc-950/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif,application/pdf"
              className="hidden"
            />

            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
                {selectedFile ? (
                  <FileCheck className="w-6 h-6 text-emerald-400" />
                ) : (
                  <Upload className="w-6 h-6" />
                )}
              </div>

              {selectedFile ? (
                <div>
                  <p className="text-sm font-semibold text-white">{selectedFile.name}</p>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">
                    {formatBytes(selectedFile.size)} • {selectedFile.type || 'Unknown MIME'}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium text-zinc-200">
                    Drag and drop your file here, or click to browse
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Supported: JPEG, PNG, WebP, SVG, GIF, PDF (Max 10 MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                Alt Text / Description (Optional)
              </label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="e.g. Demilew Terefe CV 2026 or System Architecture Diagram"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={!selectedFile || uploading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <Upload className="w-4 h-4" />
                {uploading ? 'Uploading...' : 'Confirm Upload'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Media Library Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-sky-400" /> Media Library Assets
        </h2>

        {loading ? (
          <div className="p-12 text-center text-zinc-400 text-sm">Loading media items...</div>
        ) : mediaList.length === 0 ? (
          <div className="p-12 text-center bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 text-sm">
            No media files uploaded yet. Use the upload zone above to add images or documents.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mediaList.map((item) => {
              const fileUrl = `${API_BASE}/media/files/${item.file_path}`;
              const isPdf = item.mime_type === 'application/pdf';

              return (
                <div
                  key={item.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-zinc-700 transition-colors"
                >
                  {/* Thumbnail / Preview Area */}
                  <div className="relative aspect-video bg-zinc-950 flex items-center justify-center overflow-hidden border-b border-zinc-800/80">
                    {isPdf ? (
                      <div className="flex flex-col items-center gap-2 p-4 text-center">
                        <FileText className="w-10 h-10 text-red-400" />
                        <span className="text-xs font-semibold text-zinc-300 truncate max-w-[180px]">
                          {item.filename}
                        </span>
                      </div>
                    ) : isImage(item.mime_type) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={fileUrl}
                        alt={item.alt_text || item.filename}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <FileText className="w-8 h-8 text-zinc-500" />
                    )}

                    <span className="absolute top-2 right-2 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-black/70 text-zinc-300 border border-zinc-700/60 backdrop-blur-sm">
                      {item.mime_type.split('/')[1]?.toUpperCase() || 'FILE'}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        className="text-sm font-semibold text-white truncate"
                        title={item.filename}
                      >
                        {item.filename}
                      </h3>
                      {item.alt_text && (
                        <p className="text-xs text-zinc-400 truncate mt-0.5" title={item.alt_text}>
                          {item.alt_text}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 font-mono">
                      <span>{formatBytes(item.file_size_bytes)}</span>
                      <span>{formatDate(item.created_at)}</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="px-4 py-2.5 bg-zinc-950/80 border-t border-zinc-800 flex items-center justify-between">
                    <button
                      onClick={() => handleCopyUrl(item)}
                      className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors"
                      title="Copy Public URL"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1">
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-zinc-400 hover:text-sky-400 transition-colors"
                        title="View / Download File"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                        title="Edit Alt Text"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-zinc-400 hover:text-red-400 transition-colors"
                        title="Delete File"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Alt Text Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setEditingItem(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-white mb-2">Edit Asset Metadata</h2>
            <p className="text-xs text-zinc-400 mb-4 font-mono truncate">
              {editingItem.filename}
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Alt Text / Accessibility Description
                </label>
                <input
                  type="text"
                  value={editAltText}
                  onChange={(e) => setEditAltText(e.target.value)}
                  placeholder="Describe image or document purpose"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

