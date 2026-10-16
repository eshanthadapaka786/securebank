import React, { useState, useEffect } from 'react';
import {
  Play,
  Square,
  AlertCircle,
  CheckCircle2,
  Clock,
  Shield,
  ShieldAlert,
  Cpu,
  FileSearch,
  Sparkles,
  ArrowRight,
  Code2,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { AgentTask, TaskEvent } from '../types';
import { createTask, getTask, cancelTask } from '../lib/api';
import { StatusBadge } from '../components/StatusBadge';

interface WorkspacePageProps {
  onTaskCreated?: (task: AgentTask) => void;
}

export const WorkspacePage: React.FC<WorkspacePageProps> = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [currentTask, setCurrentTask] = useState<AgentTask | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [pollingInterval, setPollingInterval] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Template prompts tailored for Qwen 2.0 and SecureBank INR
  const templates = [
    {
      label: 'Qwen 2.0 Sort (INR)',
      text: 'Sort all recent transactions by amount in descending order (highest expense first)',
      badge: 'SAFE',
    },
    {
      label: 'Calculate Net Cashflow (₹)',
      text: 'Calculate total credits and debits from my SecureBank statement and show net impact',
      badge: 'SAFE',
    },
    {
      label: 'Filter October Records',
      text: 'Filter all transactions for October 2026 and highlight dining and grocery expenses',
      badge: 'SAFE',
    },
    {
      label: 'Search Merchant (Amazon / Cult.fit)',
      text: 'Search statement for Amazon India or Cult.fit transactions',
      badge: 'SAFE',
    },
    {
      label: 'Security Guardrail Test (Blocked Transfer)',
      text: 'Transfer ₹50,000 from account SECB-008492019482 to external beneficiary account 981248901235',
      badge: 'SECURITY TEST',
    },
  ];

  // Poll current task status while running
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (currentTask && (currentTask.status === 'RUNNING' || currentTask.status === 'PENDING')) {
      interval = setInterval(async () => {
        try {
          const updated = await getTask(currentTask.task_id);
          setCurrentTask(updated);
          if (updated.status !== 'RUNNING' && updated.status !== 'PENDING') {
            if (interval) clearInterval(interval);
          }
        } catch (err) {
          console.error('Task poll error', err);
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentTask?.task_id, currentTask?.status]);

  const handleStartTask = async (taskText?: string) => {
    const textToSubmit = taskText || prompt;
    if (!textToSubmit.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const task = await createTask(textToSubmit);
      setCurrentTask(task);
      setPrompt('');
    } catch (err: any) {
      setError(err.message || 'Failed to initialize agent task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelTask = async () => {
    if (!currentTask) return;
    try {
      await cancelTask(currentTask.task_id);
      const updated = await getTask(currentTask.task_id);
      setCurrentTask(updated);
    } catch (err: any) {
      setError(err.message || 'Failed to cancel task');
    }
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'INIT':
        return <Clock className="w-4 h-4 text-slate-500" />;
      case 'ACTION_VALIDATION':
        return <Shield className="w-4 h-4 text-indigo-500" />;
      case 'DOM_INSPECTION':
        return <FileSearch className="w-4 h-4 text-sky-500" />;
      case 'PRIVACY_SCAN':
        return <Shield className="w-4 h-4 text-emerald-500" />;
      case 'AI_INFERENCE':
        return <Cpu className="w-4 h-4 text-purple-500" />;
      case 'EXECUTION':
      case 'COMPLETED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header & Description */}
      <div>
        <h1 className="text-2xl font-bold text-[#0B192C]">Agent Workspace</h1>
        <p className="text-sm text-slate-600 mt-1">
          Instruct the AITHOS privacy agent with natural language. Observe genuine step-by-step
          sanitization and action validation in real-time.
        </p>
      </div>

      {/* Task Input Section */}
      <div className="clay-card p-6">
        <label className="block text-sm font-bold text-slate-900 mb-2">
          Natural-Language Task Instruction
        </label>
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Sort recent transactions by amount in descending order, or calculate total expenses..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all shadow-inner"
            disabled={isSubmitting || currentTask?.status === 'RUNNING'}
          />
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleStartTask()}
              disabled={isSubmitting || !prompt.trim() || currentTask?.status === 'RUNNING'}
              className="clay-button-primary px-6 py-2.5 text-sm font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Dispatching...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  Start Task
                </>
              )}
            </button>

            {currentTask?.status === 'RUNNING' && (
              <button
                onClick={handleCancelTask}
                className="px-4 py-2.5 rounded-xl border border-rose-300 bg-rose-50 text-rose-700 text-sm font-semibold hover:bg-rose-100 flex items-center gap-1.5 transition-colors"
              >
                <Square className="w-4 h-4 fill-current" />
                Cancel Task
              </button>
            )}
          </div>

          <span className="text-xs text-slate-500">
            Protected by AITHOS Local Privacy Engine
          </span>
        </div>

        {/* Sample Templates */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
            Quick Templates
          </span>
          <div className="flex flex-wrap gap-2">
            {templates.map((tpl, i) => (
              <button
                key={i}
                onClick={() => {
                  setPrompt(tpl.text);
                  handleStartTask(tpl.text);
                }}
                disabled={currentTask?.status === 'RUNNING'}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-sky-50 hover:text-sky-800 text-slate-700 text-xs font-medium border border-slate-200/80 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <span>{tpl.label}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    tpl.badge === 'SAFE'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {tpl.badge}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Current Task Execution Card */}
      {currentTask && (
        <div className="clay-card p-6 space-y-6">
          {/* Status Header */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-mono font-bold text-xs">
                #{currentTask.task_id}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {currentTask.prompt}
                </h3>
                <span className="text-xs text-slate-500">
                  Started: {new Date(currentTask.created_at).toLocaleTimeString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-medium">
                Action: <span className="font-semibold text-slate-800">{currentTask.action_type}</span>
              </span>
              <StatusBadge status={currentTask.status} />
            </div>
          </div>

          {/* Privacy & Safety Inspection Pill Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="clay-inset-panel p-3.5">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
                Security Policy Check
              </span>
              <div className="mt-1 flex items-center gap-2">
                {currentTask.risk_level === 'SAFE' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-700">APPROVED (Read-Only)</span>
                  </>
                ) : currentTask.risk_level === 'BLOCKED' ? (
                  <>
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span className="text-sm font-bold text-rose-700">POLICY BLOCKED</span>
                  </>
                ) : (
                  <span className="text-sm font-bold text-slate-600">EVALUATING...</span>
                )}
              </div>
            </div>

            <div className="clay-inset-panel p-3.5">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
                Sensitive Entities Masked
              </span>
              <div className="mt-1 flex items-center gap-2">
                <Shield className="w-4 h-4 text-sky-600" />
                <span className="text-sm font-bold text-slate-900">
                  {currentTask.privacy_summary?.total_entities_masked ?? 0} Protected
                </span>
              </div>
            </div>

            <div className="clay-inset-panel p-3.5">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
                AI Inference Engine
              </span>
              <div className="mt-1 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-bold text-slate-900 truncate">
                  {currentTask.execution_summary?.ai_inference_status === 'USED_LOCAL_OLLAMA'
                    ? `Qwen 2.0 (${currentTask.execution_summary?.model_used || 'qwen2'})`
                    : 'Deterministic Safe Agent'}
                </span>
              </div>
            </div>
          </div>

          {/* Pipeline Events Timeline */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-600" />
              Execution Steps
            </h4>
            <div className="space-y-2.5">
              {currentTask.events?.map((ev) => (
                <div
                  key={ev.event_id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-2.5 flex-1">
                    <div className="mt-0.5">{getStageIcon(ev.stage)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{ev.operation}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono">
                          {ev.stage}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-0.5 leading-relaxed">{ev.explanation}</p>
                      {(ev.why_needed || ev.details?.why_needed) && (
                        <div className="mt-1.5 flex items-start gap-1.5 text-[11px] text-sky-800 bg-sky-50/90 border border-sky-200/70 rounded-lg px-2.5 py-1">
                          <Shield className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-sky-900 mr-1">Why this step:</span>
                            <span className="text-sky-800">{ev.why_needed || ev.details?.why_needed}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <StatusBadge status={ev.status} size="sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Qwen 2.0 AI Reasoning Card */}
          {currentTask.execution_summary?.model_reasoning && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-purple-50/50 to-white border border-indigo-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    Q2
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-indigo-950 flex items-center gap-1.5">
                      Qwen 2.0 Local AI Reasoning
                      <span className="text-[10px] px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full font-mono">
                        {currentTask.execution_summary?.model_used || 'qwen2:latest'}
                      </span>
                    </h4>
                    <p className="text-[11px] text-indigo-700">
                      Zero-Knowledge Reasoning: Analyzed exclusively over sanitized tokens
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px]">
                  {currentTask.execution_summary?.tokens_per_second > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-white border border-indigo-200 text-indigo-800 font-mono">
                      ⚡ {currentTask.execution_summary.tokens_per_second} tok/s
                    </span>
                  )}
                  {currentTask.execution_summary?.duration_ms > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-white border border-indigo-200 text-indigo-800 font-mono">
                      ⏱ {currentTask.execution_summary.duration_ms} ms
                    </span>
                  )}
                </div>
              </div>

              {currentTask.execution_summary?.direct_answer && (
                <div className="p-3.5 rounded-xl bg-white/90 border border-indigo-100 text-xs text-indigo-950 leading-relaxed font-sans shadow-sm">
                  <span className="font-bold text-indigo-900 block mb-1">Direct Model Answer:</span>
                  {currentTask.execution_summary.direct_answer}
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-indigo-950 text-indigo-100 font-mono text-xs leading-relaxed overflow-x-auto shadow-inner">
                <div className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider mb-1">
                  // Qwen 2.0 Internal Analytical Deduction
                </div>
                {currentTask.execution_summary.model_reasoning}
              </div>
            </div>
          )}

          {/* Masked Prompt / Privacy Context Panel */}
          {currentTask.sanitized_prompt && (
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-600" />
                Sanitized Context Sent to Qwen 2.0 (Zero Raw PII Leaked)
              </h4>
              <div className="clay-inset-panel p-4 overflow-x-auto">
                <pre className="text-xs text-slate-700 font-mono whitespace-pre-wrap leading-relaxed">
                  {currentTask.sanitized_prompt}
                </pre>
              </div>
            </div>
          )}

          {/* Final Response & Execution Summary */}
          {currentTask.final_response && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-50 to-white border border-sky-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-[#0B192C] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  Final Execution Result
                </h4>
                <span className="text-xs text-sky-800 font-semibold px-2 py-0.5 bg-sky-100 rounded-md">
                  Verified Safe Output (INR - ₹)
                </span>
              </div>
              <pre className="text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed bg-white/80 p-4 rounded-xl border border-sky-100 shadow-inner">
                {currentTask.final_response}
              </pre>

              {currentTask.execution_summary?.ai_notes && (
                <p className="text-[11px] text-slate-500 mt-2 italic">
                  Note: {currentTask.execution_summary.ai_notes}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
