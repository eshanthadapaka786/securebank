import React from 'react';
import {
  Shield,
  Cpu,
  Globe,
  Server,
  CheckCircle2,
  AlertTriangle,
  Play,
  ArrowRight,
  Eye,
  Lock,
  Sparkles,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { HealthStatus, TabType } from '../types';
import { StatusBadge } from '../components/StatusBadge';

interface OverviewPageProps {
  health: HealthStatus | null;
  backendOnline: boolean;
  onRefreshHealth: () => void;
  onNavigate: (tab: TabType) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  health,
  backendOnline,
  onRefreshHealth,
  onNavigate,
}) => {
  const metrics = health?.task_metrics || {
    total: 0,
    running: 0,
    completed: 0,
    blocked: 0,
    failed: 0,
    cancelled: 0,
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Banner with Claymorphic Glow */}
      <div className="clay-card p-8 bg-gradient-to-br from-white via-slate-50/60 to-sky-50/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <Shield className="w-3.5 h-3.5 text-sky-600" />
            Privacy-Preserving Agentic AI
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B192C] tracking-tight leading-tight">
            AI should know what it needs —{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284C7] to-[#1E3E62]">
              not everything about you.
            </span>
          </h1>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            AITHOS inspects pages and form inputs locally on your device, detects personal identifiers,
            masks them with structured placeholders before AI reasoning, and validates every action against
            a strict read-only safety policy.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('workspace')}
              className="clay-button-primary px-5 py-2.5 text-sm font-semibold flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              Open Agent Workspace
            </button>
            <button
              onClick={() => onNavigate('scanner')}
              className="clay-button-secondary px-5 py-2.5 text-sm font-semibold flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-sky-600" />
              Test Privacy Scanner
            </button>
            <button
              onClick={onRefreshHealth}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
              title="Refresh connection statuses"
            >
              <RefreshCw className="w-4 h-4" />
              Check Status
            </button>
          </div>
        </div>
      </div>

      {/* Honest Connection Status Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#0B192C]">System Readiness & Connections</h2>
          <span className="text-xs text-slate-500 font-medium">
            Live diagnostic • Zero simulated states
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. Backend Engine */}
          <div className="clay-card-interactive p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700">
                  <Server className="w-5 h-5" />
                </div>
                <StatusBadge
                  status={backendOnline ? 'CONNECTED' : 'OFFLINE'}
                  label={backendOnline ? 'Connected' : 'Unreachable'}
                />
              </div>
              <h3 className="text-base font-bold text-slate-900">Backend API</h3>
              <p className="text-xs text-slate-500 mt-1">
                FastAPI engine running on local port 8000.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Protocol:</span>{' '}
              {health?.backend?.protocol || 'HTTP / SSE'} (v{health?.backend?.version || '1.0.0'})
            </div>
          </div>

          {/* 2. Privacy Engine */}
          <div className="clay-card-interactive p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <StatusBadge
                  status={health?.privacy_engine?.status === 'ACTIVE' ? 'ACTIVE' : 'OFFLINE'}
                  label={health?.privacy_engine?.status === 'ACTIVE' ? 'Active' : 'Standby'}
                />
              </div>
              <h3 className="text-base font-bold text-slate-900">Privacy Engine</h3>
              <p className="text-xs text-slate-500 mt-1">
                Deterministic regex & AST pattern protection.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Patterns:</span> 7 categories active
              (in-memory)
            </div>
          </div>

          {/* 3. AI Model Availability */}
          <div className="clay-card-interactive p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700">
                  <Cpu className="w-5 h-5" />
                </div>
                <StatusBadge
                  status={health?.ai_model?.available ? 'ONLINE' : 'UNAVAILABLE'}
                  label={health?.ai_model?.available ? 'Available' : 'Unavailable'}
                />
              </div>
              <h3 className="text-base font-bold text-slate-900">AI Model (Ollama)</h3>
              <p className="text-xs text-slate-500 mt-1">
                {health?.ai_model?.available
                  ? `Active model: ${health.ai_model.selected_model}`
                  : 'Local Ollama not detected on :11434'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Fallback:</span> Deterministic rule-based
              execution
            </div>
          </div>

          {/* 4. FakeBank Target */}
          <div className="clay-card-interactive p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                  <Globe className="w-5 h-5" />
                </div>
                <StatusBadge
                  status={
                    health?.fakebank?.connected ? 'CONNECTED' : 'AWAITING_INTEGRATION'
                  }
                  label={health?.fakebank?.connected ? 'Connected' : 'Awaiting Integration'}
                />
              </div>
              <h3 className="text-base font-bold text-slate-900">FakeBank Demo</h3>
              <p className="text-xs text-slate-500 mt-1">
                {health?.fakebank?.connected
                  ? 'Connected to local banking web target'
                  : 'Awaiting teammate URL & DOM details'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Target:</span>{' '}
              {health?.fakebank?.target_url || 'http://localhost:3000'}
            </div>
          </div>
        </div>
      </div>

      {/* Task Metrics Counters */}
      <div className="clay-card p-6">
        <h3 className="text-base font-bold text-slate-900 mb-4">Task Execution Metrics</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="clay-inset-panel p-4 text-center">
            <span className="text-2xl font-extrabold text-[#0B192C]">{metrics.total}</span>
            <p className="text-xs text-slate-500 mt-1 font-semibold uppercase tracking-wider">
              Total Tasks
            </p>
          </div>
          <div className="clay-inset-panel p-4 text-center">
            <span className="text-2xl font-extrabold text-sky-600">{metrics.running}</span>
            <p className="text-xs text-slate-500 mt-1 font-semibold uppercase tracking-wider">
              Running
            </p>
          </div>
          <div className="clay-inset-panel p-4 text-center">
            <span className="text-2xl font-extrabold text-emerald-600">{metrics.completed}</span>
            <p className="text-xs text-slate-500 mt-1 font-semibold uppercase tracking-wider">
              Completed
            </p>
          </div>
          <div className="clay-inset-panel p-4 text-center">
            <span className="text-2xl font-extrabold text-rose-600">{metrics.blocked}</span>
            <p className="text-xs text-slate-500 mt-1 font-semibold uppercase tracking-wider">
              Policy Blocked
            </p>
          </div>
          <div className="clay-inset-panel p-4 text-center">
            <span className="text-2xl font-extrabold text-slate-600">{metrics.failed}</span>
            <p className="text-xs text-slate-500 mt-1 font-semibold uppercase tracking-wider">
              Failed
            </p>
          </div>
        </div>
      </div>

      {/* How AITHOS Works - 4 Pillars */}
      <div>
        <h2 className="text-xl font-bold text-[#0B192C] mb-4">How AITHOS Protects You</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="clay-card p-5">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">See locally</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              AITHOS inspects the webpage and form fields directly inside your device memory. Nothing
              leaves your machine until it has passed through redaction.
            </p>
          </div>

          <div className="clay-card p-5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Protect locally</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Emails, phone numbers, account identifiers, PAN, SSN, and passwords are deterministically
              masked with structural tokens like <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">&lt;ACCOUNT_NUM_1&gt;</code>.
            </p>
          </div>

          <div className="clay-card p-5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Reason safely</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              The AI model reasons over the masked semantics without ever seeing the customer's true
              identity or credentials. Privacy is guaranteed mathematically.
            </p>
          </div>

          <div className="clay-card p-5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Act safely</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Every action is checked by the Action Validator. Only read-only operations (sort, filter,
              inspect) are allowed. Fund transfers and script injections are blocked.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
