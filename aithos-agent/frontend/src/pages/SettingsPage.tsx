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
import { getSettings, updateSettings, pullModel } from '../lib/api';
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
  const [isPulling, setIsPulling] = useState<boolean>(false);
  const [pullInput, setPullInput] = useState<string>('qwen2:latest');
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

  const handlePullModel = async (modelToPull?: string) => {
    const target = modelToPull || pullInput;
    if (!target.trim()) return;
    setIsPulling(true);
    setMessage(null);
    try {
      const res = await pullModel(target);
      if (res.status === 'SUCCESS') {
        setMessage({ text: `Successfully pulled ${target}! Model is now available and active.`, type: 'success' });
        setOllamaModel(target);
        await fetchSettings();
        onRefreshHealth();
      } else {
        setMessage({ text: res.error || `Failed to pull ${target}`, type: 'error' });
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to pull model', type: 'error' });
    } finally {
      setIsPulling(false);
    }
  };

  const qwenPresets = [
    { id: 'qwen2:latest', label: 'Qwen 2.0 (latest)', desc: 'Recommended default' },
    { id: 'qwen2:1.5b', label: 'Qwen 2 (1.5B)', desc: 'Fast & accurate' },
    { id: 'qwen2:0.5b', label: 'Qwen 2 (0.5B)', desc: 'Ultra-fast / lightweight' },
    { id: 'qwen2:7b', label: 'Qwen 2 (7B)', desc: 'High capability' },
    { id: 'qwen2.5:latest', label: 'Qwen 2.5', desc: 'Latest generation' },
  ];

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

      {/* 2. AI Inference Engine (Qwen 2.0 via Ollama) */}
      <div className="clay-card p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold text-xs">
              Q2
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Local AI Inference: Qwen 2.0 (Ollama)
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                  Privacy Sandbox
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Alibaba Cloud Qwen 2.0 LLM for structured financial reasoning over sanitized context.
              </p>
            </div>
          </div>

          <StatusBadge
            status={settings?.ollama_status?.available ? 'ONLINE' : 'UNAVAILABLE'}
            label={settings?.ollama_status?.available ? 'Qwen 2.0 / Ollama Online' : 'Ollama Offline'}
          />
        </div>

        {/* Quick Model Selector Presets */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Select Qwen 2.0 Model Preset
          </label>
          <div className="flex flex-wrap gap-2">
            {qwenPresets.map((preset) => {
              const isInstalled = settings?.ollama_status?.installed_models?.some((m) =>
                m.toLowerCase().startsWith(preset.id.toLowerCase())
              );
              const isSelected = ollamaModel.toLowerCase() === preset.id.toLowerCase();
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setOllamaModel(preset.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300'
                      : isInstalled
                      ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span>{preset.label}</span>
                  {isInstalled && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-200/60 text-indigo-900">
                      Installed
                    </span>
                  )}
                </button>
              );
            })}
          </div>
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
              placeholder="http://127.0.0.1:11434"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Active Model Name
            </label>
            <input
              type="text"
              value={ollamaModel}
              onChange={(e) => setOllamaModel(e.target.value)}
              placeholder="qwen2:latest"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Installed Models Tags */}
        {settings?.ollama_status?.installed_models && settings.ollama_status.installed_models.length > 0 && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
              Detected Installed Models on Local Ollama ({settings.ollama_status.installed_models.length}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {settings.ollama_status.installed_models.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setOllamaModel(m)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                    ollamaModel === m
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200'
                  }`}
                  title="Click to select this model"
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pull Model Helper */}
        <div className="flex items-center gap-2 pt-1 flex-wrap">
          <input
            type="text"
            value={pullInput}
            onChange={(e) => setPullInput(e.target.value)}
            placeholder="e.g. qwen2:latest or qwen2:7b"
            className="flex-1 min-w-[200px] px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="button"
            disabled={isPulling}
            onClick={() => handlePullModel()}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            {isPulling ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            {isPulling ? 'Pulling Model...' : 'Pull Model via Ollama'}
          </button>
        </div>

        <div className="text-xs text-slate-500 flex items-center justify-between flex-wrap gap-2">
          <span>{settings?.ollama_status?.status_text || 'Checking Ollama daemon...'}</span>
          <span className="font-semibold text-indigo-700">
            Model Family: Qwen 2.0 (Zero-PII JSON Mode)
          </span>
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
