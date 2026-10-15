import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Server,
  Cpu,
  Globe,
  Shield,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Code,
} from 'lucide-react';
import { getSettings, updateSettings } from '../lib/api';
import { SystemSettings } from '../types';
import { StatusBadge } from '../components/StatusBadge';

interface SettingsPageProps {
  onRefreshHealth: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onRefreshHealth }) => {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [fakebankUrl, setFakebankUrl] = useState<string>('');
  const [ollamaEndpoint, setOllamaEndpoint] = useState<string>('');
  const [ollamaModel, setOllamaModel] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchSettings = async () => {
    try {
      const data = await getSettings();
      setSettings(data);
      setFakebankUrl(data.fakebank_url);
      setOllamaEndpoint(data.ollama_endpoint);
      setOllamaModel(data.ollama_model);
    } catch (err) {
      console.error('Failed to load settings', err);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const updated = await updateSettings({
        fakebank_url: fakebankUrl,
        ollama_endpoint: ollamaEndpoint,
        ollama_model: ollamaModel,
      });
      setSettings(updated);
      setMessage({ text: 'Configuration saved successfully', type: 'success' });
      onRefreshHealth();
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to update settings', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0B192C] flex items-center gap-2.5">
          <Sliders className="w-6 h-6 text-sky-600" />
          System Settings & Integration Hub
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Configure local endpoints, AI inference providers, and external web target parameters.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* 1. FakeBank Integration Configuration */}
      <div className="clay-card p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">FakeBank Web Integration</h2>
              <p className="text-xs text-slate-500">
                Target banking application built independently by team member.
              </p>
            </div>
          </div>

          <StatusBadge
            status={settings?.fakebank_status?.connected ? 'CONNECTED' : 'AWAITING_INTEGRATION'}
            label={settings?.fakebank_status?.connected ? 'Target Live' : 'Awaiting Integration'}
          />
        </div>

        <div className="bg-amber-50/60 border border-amber-200/80 p-4 rounded-xl text-xs text-amber-900 leading-relaxed">
          <span className="font-bold">Team Context Note:</span> Another teammate is independently
          building the FakeBank website. When they provide their local development URL (e.g.,{' '}
          <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">http://localhost:3000</code>),
          enter it below and click Save & Probe. AITHOS will connect and read the DOM securely.
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            FakeBank Target URL
          </label>
          <input
            type="url"
            value={fakebankUrl}
            onChange={(e) => setFakebankUrl(e.target.value)}
            placeholder="http://localhost:3000"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
          />
        </div>

        <div className="text-xs text-slate-500 flex items-center justify-between">
          <span>Status Message: {settings?.fakebank_status?.message || 'Probing...'}</span>
          <span className="font-mono text-[11px]">
            Last Probe: {new Date(settings?.fakebank_status?.last_checked || '').toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* 2. AI Inference Engine (Ollama) */}
      <div className="clay-card p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-800">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Local AI Inference (Ollama)</h2>
              <p className="text-xs text-slate-500">
                Local LLM connection for reasoning over sanitized context.
              </p>
            </div>
          </div>

          <StatusBadge
            status={settings?.ollama_status?.available ? 'ONLINE' : 'UNAVAILABLE'}
            label={settings?.ollama_status?.available ? 'Ollama Online' : 'Ollama Offline'}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Ollama Daemon Endpoint
            </label>
            <input
              type="url"
              value={ollamaEndpoint}
              onChange={(e) => setOllamaEndpoint(e.target.value)}
              placeholder="http://localhost:11434"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Target Model Name
            </label>
            <input
              type="text"
              value={ollamaModel}
              onChange={(e) => setOllamaModel(e.target.value)}
              placeholder="llama3:latest"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
            />
          </div>
        </div>

        <div className="text-xs text-slate-500 flex items-center justify-between">
          <span>{settings?.ollama_status?.status_text || 'Checking Ollama daemon...'}</span>
          {settings?.ollama_status?.installed_models && (
            <span className="font-semibold text-slate-700">
              Installed Models: {settings.ollama_status.installed_models.length}
            </span>
          )}
        </div>
      </div>

      {/* 3. Security Policy Matrix */}
      <div className="clay-card p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Action Security Policies</h2>
            <p className="text-xs text-slate-500">
              Deterministic whitelist/blacklist enforced before browser interaction.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Approved Whitelist */}
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
            <span className="font-bold text-emerald-800 uppercase tracking-wider block mb-2">
              Approved Read-Only Actions
            </span>
            <ul className="space-y-1.5 text-emerald-950 font-mono text-[11px]">
              {settings?.approved_actions &&
                Object.entries(settings.approved_actions).map(([act, desc]) => (
                  <li key={act} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-900">{act}:</strong> {desc}
                    </span>
                  </li>
                ))}
            </ul>
          </div>

          {/* Blocked Blacklist */}
          <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200">
            <span className="font-bold text-rose-800 uppercase tracking-wider block mb-2">
              Disallowed Dangerous Operations
            </span>
            <ul className="space-y-1.5 text-rose-950 font-mono text-[11px]">
              {settings?.disallowed_actions &&
                Object.entries(settings.disallowed_actions).map(([act, desc]) => (
                  <li key={act} className="flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-900">{act}:</strong> {desc}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="clay-button-primary px-6 py-2.5 text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save & Test Connection
            </>
          )}
        </button>
      </div>
    </div>
  );
};
