import React, { useState, useEffect } from 'react';
import {
  FileText,
  Filter,
  Download,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Shield,
  Clock,
  Layers,
} from 'lucide-react';
import { getAuditLogs } from '../lib/api';
import { AuditLogEntry } from '../types';
import { StatusBadge } from '../components/StatusBadge';

export const AuditPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const data = await getAuditLogs(
        100,
        categoryFilter === 'ALL' ? undefined : categoryFilter
      );
      setLogs(data);
    } catch (err) {
      console.error('Audit fetch failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [categoryFilter]);

  const filteredLogs = logs.filter((log) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      log.summary.toLowerCase().includes(term) ||
      log.event_type.toLowerCase().includes(term) ||
      (log.task_id && log.task_id.toLowerCase().includes(term))
    );
  });

  const exportToJson = () => {
    const jsonStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(logs, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonStr);
    downloadAnchor.setAttribute('download', `aithos_audit_logs_${new Date().toISOString()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B192C] flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-sky-600" />
            Audit Logs & Compliance Trail
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Tamper-evident record of all privacy transformations, action validations, and agent
            decisions. Zero raw personal data is ever recorded.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportToJson}
            className="clay-button-secondary px-4 py-2 text-xs font-semibold flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>
          <button
            onClick={fetchLogs}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm transition-colors"
            title="Refresh logs"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="clay-card p-4 flex items-center justify-between flex-wrap gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by event summary, type, or task ID..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['ALL', 'PRIVACY', 'SECURITY', 'AGENT', 'SYSTEM'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                categoryFilter === cat
                  ? 'bg-[#1E3E62] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table Card */}
      <div className="clay-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Event ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Stage / Type</th>
                <th className="py-3 px-4">Audit Summary</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    No matching audit events found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((entry) => (
                  <tr key={entry.event_id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-600">
                      #{entry.event_id}
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap font-mono">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-700">{entry.category}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[10px] text-slate-800">
                        {entry.event_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-800 max-w-md truncate font-medium">
                      {entry.summary}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={entry.status as any} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedEntry(entry)}
                        className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 font-semibold transition-colors"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="clay-card max-w-2xl w-full p-6 max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Audit Record #{selectedEntry.event_id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="clay-inset-panel p-3">
                <span className="text-slate-400 font-semibold block">Timestamp (UTC)</span>
                <span className="text-slate-800 font-mono font-medium">
                  {selectedEntry.timestamp}
                </span>
              </div>
              <div className="clay-inset-panel p-3">
                <span className="text-slate-400 font-semibold block">Category</span>
                <span className="text-slate-800 font-semibold">{selectedEntry.category}</span>
              </div>
              <div className="clay-inset-panel p-3">
                <span className="text-slate-400 font-semibold block">Event Type</span>
                <span className="text-slate-800 font-mono">{selectedEntry.event_type}</span>
              </div>
              <div className="clay-inset-panel p-3">
                <span className="text-slate-400 font-semibold block">Task ID</span>
                <span className="text-slate-800 font-mono">
                  {selectedEntry.task_id || 'N/A (System)'}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1">Human Summary</span>
              <p className="text-xs text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200">
                {selectedEntry.summary}
              </p>
            </div>

            {selectedEntry.details?.why_needed && (
              <div>
                <span className="text-xs font-bold text-sky-800 block mb-1">
                  Privacy & Security Rationale
                </span>
                <p className="text-xs text-sky-900 bg-sky-50 p-3 rounded-xl border border-sky-200">
                  {selectedEntry.details.why_needed}
                </p>
              </div>
            )}

            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1">
                Safe Payload Details (Strictly Sanitized)
              </span>
              <pre className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800">
                {JSON.stringify(selectedEntry.details, null, 2)}
              </pre>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedEntry(null)}
                className="clay-button-primary px-5 py-2 text-xs font-semibold"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
