import React, { useState, useEffect } from 'react';
import {
  Activity,
  Filter,
  RefreshCw,
  Shield,
  ShieldAlert,
  Cpu,
  FileSearch,
  CheckCircle2,
  Clock,
  Sparkles,
  Radio,
} from 'lucide-react';
import { TaskEvent } from '../types';
import { subscribeToEvents, getAuditLogs } from '../lib/api';
import { StatusBadge } from '../components/StatusBadge';

export const TimelinePage: React.FC = () => {
  const [events, setEvents] = useState<TaskEvent[]>([]);
  const [filter, setFilter] = useState<string>('ALL');
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Subscribe to live SSE events from backend
  useEffect(() => {
    // Also load recent events initially from audit trail
    getAuditLogs(30).then((logs) => {
      const mappedEvents: TaskEvent[] = logs.map((l) => ({
        event_id: l.event_id,
        task_id: l.task_id || 'system',
        timestamp: l.timestamp,
        stage: l.event_type,
        operation: l.category,
        explanation: l.summary,
        why_needed: l.details?.why_needed || '',
        status: (l.status as any) || 'SUCCESS',
        details: l.details || {},
      }));
      setEvents(mappedEvents);
    }).catch(console.error);

    const unsubscribe = subscribeToEvents(
      (newEvent) => {
        setIsConnected(true);
        setEvents((prev) => [newEvent, ...prev]);
      },
      (err) => {
        setIsConnected(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const filteredEvents = events.filter((e) => {
    if (filter === 'ALL') return true;
    if (filter === 'PRIVACY') return e.stage.includes('PRIVACY') || e.operation.includes('PRIVACY');
    if (filter === 'SECURITY') return e.stage.includes('VALIDATION') || e.status === 'BLOCKED';
    if (filter === 'AI') return e.stage.includes('AI') || e.operation.includes('Ollama');
    if (filter === 'EXECUTION') return e.stage.includes('EXECUTION') || e.stage.includes('COMPLETED');
    return true;
  });

  const getStageBadge = (stage: string) => {
    if (stage.includes('PRIVACY')) return 'bg-emerald-100 text-emerald-800';
    if (stage.includes('VALIDATION') || stage.includes('POLICY')) return 'bg-rose-100 text-rose-800';
    if (stage.includes('AI')) return 'bg-purple-100 text-purple-800';
    if (stage.includes('DOM')) return 'bg-sky-100 text-sky-800';
    return 'bg-slate-100 text-slate-800';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B192C] flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-sky-600" />
            Live Activity Timeline
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Real-time telemetry stream directly from the AITHOS agent event bus.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs shadow-sm">
            <Radio
              className={`w-3.5 h-3.5 ${
                isConnected ? 'text-emerald-500 animate-pulse' : 'text-slate-400'
              }`}
            />
            <span className="font-semibold text-slate-700">
              {isConnected ? 'SSE Live Stream Active' : 'Connecting Event Stream...'}
            </span>
          </div>

          <button
            onClick={async () => {
              const logs = await getAuditLogs(40);
              const mappedEvents: TaskEvent[] = logs.map((l) => ({
                event_id: l.event_id,
                task_id: l.task_id || 'system',
                timestamp: l.timestamp,
                stage: l.event_type,
                operation: l.category,
                explanation: l.summary,
                status: (l.status as any) || 'SUCCESS',
                details: l.details || {},
              }));
              setEvents(mappedEvents);
            }}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm transition-colors"
            title="Refresh events"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="w-4 h-4 text-slate-400 mr-1" />
        {['ALL', 'PRIVACY', 'SECURITY', 'AI', 'EXECUTION'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === cat
                ? 'bg-[#1E3E62] text-white shadow-md shadow-sky-900/10'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80 shadow-sm'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Timeline List */}
      <div className="clay-card p-6">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Activity className="w-10 h-10 mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-semibold">No activity events recorded yet.</p>
            <p className="text-xs text-slate-400 mt-1">
              Dispatch a task from the Agent Workspace or trigger the Privacy Scanner to generate live telemetry.
            </p>
          </div>
        ) : (
          <div className="relative border-l-2 border-slate-200 ml-4 space-y-6">
            {filteredEvents.map((ev, idx) => (
              <div key={ev.event_id + idx} className="relative pl-6">
                {/* Timeline node */}
                <span
                  className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                    ev.status === 'SUCCESS'
                      ? 'bg-emerald-500'
                      : ev.status === 'BLOCKED'
                      ? 'bg-rose-500'
                      : ev.status === 'WARNING'
                      ? 'bg-amber-500'
                      : 'bg-sky-500'
                  }`}
                />

                <div className="clay-card-interactive p-4 bg-white">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{ev.operation}</span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${getStageBadge(
                          ev.stage
                        )}`}
                      >
                        {ev.stage}
                      </span>
                      {ev.task_id && ev.task_id !== 'system' && (
                        <span className="text-[10px] font-mono text-slate-400">
                          #{ev.task_id}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-mono">
                        {new Date(ev.timestamp).toLocaleTimeString()}
                      </span>
                      <StatusBadge status={ev.status} size="sm" />
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">{ev.explanation}</p>

                  {(ev.why_needed || ev.details?.why_needed) && (
                    <div className="mt-2 flex items-start gap-1.5 text-xs text-sky-800 bg-sky-50/90 border border-sky-200/70 rounded-lg px-2.5 py-1.5">
                      <Shield className="w-3.5 h-3.5 text-sky-600 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-semibold text-sky-900 mr-1">Privacy & Security Rationale:</span>
                        <span className="text-sky-800">{ev.why_needed || ev.details?.why_needed}</span>
                      </div>
                    </div>
                  )}

                  {/* Safe Details Inspector */}
                  {ev.details && Object.keys(ev.details).length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100">
                      <details className="text-[11px] text-slate-500">
                        <summary className="cursor-pointer hover:text-slate-800 font-medium">
                          Safe payload details ({Object.keys(ev.details).length} fields)
                        </summary>
                        <pre className="mt-1 p-2 rounded-lg bg-slate-50 font-mono text-[10px] text-slate-700 overflow-x-auto border border-slate-200">
                          {JSON.stringify(ev.details, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
