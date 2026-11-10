'use client';

import React, { useEffect, useState } from 'react';
import { MessageSquare, Mail, Trash2, CheckCircle2, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { cmsMessages, ContactMessageData } from '@/lib/cms-api';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMsg, setSelectedMsg] = useState<ContactMessageData | null>(null);
  const [filterUnread, setFilterUnread] = useState(false);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await cmsMessages.listAll();
      setMessages(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleSelectMessage = async (msg: ContactMessageData) => {
    setSelectedMsg(msg);
    if (!msg.read) {
      try {
        await cmsMessages.markRead(msg.id, true);
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m))
        );
      } catch {}
    }
  };

  const handleToggleRead = async (e: React.MouseEvent, msg: ContactMessageData) => {
    e.stopPropagation();
    try {
      await cmsMessages.markRead(msg.id, !msg.read);
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, read: !msg.read } : m))
      );
      if (selectedMsg?.id === msg.id) {
        setSelectedMsg({ ...selectedMsg, read: !msg.read });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      }
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await cmsMessages.delete(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMsg?.id === id) {
        setSelectedMsg(null);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      }
    }
  };

  const filtered = filterUnread ? messages.filter((m) => !m.read) : messages;
  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-1">
            <MessageSquare className="w-4 h-4" />
            <span>Public Communications</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Contact Messages & Inquiries</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review collaboration requests, project inquiries, and messages submitted from the public contact form.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilterUnread(!filterUnread)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              filterUnread
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <span>Unread Only ({unreadCount})</span>
          </button>

          <button
            onClick={loadMessages}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Two Column Layout: List and Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Messages List */}
        <div className="lg:col-span-5 bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/60 shadow-xl max-h-[700px] overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-500 text-xs">Loading messages...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs italic">
              {filterUnread ? 'No unread messages.' : 'No contact messages received yet.'}
            </div>
          ) : (
            filtered.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleSelectMessage(msg)}
                className={`p-4 cursor-pointer transition-colors text-xs flex flex-col gap-1.5 ${
                  selectedMsg?.id === msg.id
                    ? 'bg-cyan-500/10 border-l-2 border-cyan-400'
                    : msg.read
                    ? 'hover:bg-slate-800/40 opacity-75'
                    : 'hover:bg-slate-800/60 bg-slate-900/40 font-semibold'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium truncate">{msg.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="text-slate-300 font-medium truncate">{msg.subject}</div>
                <div className="text-slate-500 text-[11px] truncate">{msg.message}</div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400 font-mono">{msg.email}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleToggleRead(e, msg)}
                      className={`text-[10px] px-1.5 py-0.5 rounded border ${
                        msg.read
                          ? 'border-slate-700 text-slate-500'
                          : 'border-amber-500/30 text-amber-400 bg-amber-500/10'
                      }`}
                    >
                      {msg.read ? 'Mark Unread' : 'New'}
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, msg.id)}
                      className="text-slate-500 hover:text-rose-400 p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Detail Viewer */}
        <div className="lg:col-span-7 bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl min-h-[400px]">
          {selectedMsg ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white">{selectedMsg.subject}</h2>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-mono">
                    <span>From:</span>
                    <span className="text-cyan-400 font-medium">{selectedMsg.name}</span>
                    <span>&lt;{selectedMsg.email}&gt;</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(selectedMsg.created_at).toLocaleString()}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 text-slate-200 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                {selectedMsg.message}
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                <a
                  href={`mailto:${selectedMsg.email}?subject=Re: ${encodeURIComponent(selectedMsg.subject)}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs shadow-lg shadow-cyan-500/20 transition-all"
                >
                  <Mail className="w-4 h-4" />
                  <span>Reply via Email</span>
                </a>

                <button
                  onClick={(e) => handleDelete(e, selectedMsg.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-900/60 bg-rose-950/20 text-rose-400 hover:bg-rose-950/40 text-xs font-medium transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Message</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-16">
              <Mail className="w-12 h-12 text-slate-700 mb-3" />
              <p className="text-sm font-medium text-slate-400">Select an inquiry to view details</p>
              <p className="text-xs text-slate-600 mt-1">Inbound messages will be rendered here for reading and replying.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

