import {
  HealthStatus,
  PrivacyScanResponse,
  AgentTask,
  AuditLogEntry,
  SystemSettings,
  TaskEvent,
} from '../types';

const API_BASE = 'http://127.0.0.1:8000/api';

export async function getHealth(): Promise<HealthStatus> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`);
  return res.json();
}

export async function scanPrivacy(text: string): Promise<PrivacyScanResponse> {
  const res = await fetch(`${API_BASE}/privacy/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`Privacy scan failed: ${res.statusText}`);
  return res.json();
}

export async function createTask(prompt: string): Promise<AgentTask> {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) throw new Error(`Task creation failed: ${res.statusText}`);
  return res.json();
}

export async function listTasks(): Promise<AgentTask[]> {
  const res = await fetch(`${API_BASE}/tasks`);
  if (!res.ok) throw new Error(`Failed to list tasks: ${res.statusText}`);
  return res.json();
}

export async function getTask(taskId: string): Promise<AgentTask> {
  const res = await fetch(`${API_BASE}/tasks/${taskId}`);
  if (!res.ok) throw new Error(`Failed to get task: ${res.statusText}`);
  return res.json();
}

export async function cancelTask(taskId: string): Promise<{ cancelled: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/tasks/${taskId}/cancel`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error(`Failed to cancel task: ${res.statusText}`);
  return res.json();
}

export async function getAuditLogs(
  limit: number = 50,
  category?: string,
  status?: string
): Promise<AuditLogEntry[]> {
  const params = new URLSearchParams({ limit: limit.toString() });
  if (category) params.append('category', category);
  if (status) params.append('status', status);

  const res = await fetch(`${API_BASE}/audit?${params.toString()}`);
  if (!res.ok) throw new Error(`Failed to fetch audit logs: ${res.statusText}`);
  return res.json();
}

export async function getSettings(): Promise<SystemSettings> {
  const res = await fetch(`${API_BASE}/settings`);
  if (!res.ok) throw new Error(`Failed to fetch settings: ${res.statusText}`);
  return res.json();
}

export async function updateSettings(
  data: Partial<{ fakebank_url: string; ollama_endpoint: string; ollama_model: string }>
): Promise<SystemSettings> {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to update settings: ${res.statusText}`);
  return res.json();
}

export function subscribeToEvents(
  onEvent: (event: TaskEvent) => void,
  onError?: (err: any) => void
): () => void {
  const sse = new EventSource(`${API_BASE}/events`);

  sse.onmessage = (msg) => {
    try {
      const data = JSON.parse(msg.data);
      if (data && data.event_id) {
        onEvent(data as TaskEvent);
      }
    } catch {
      // Ignored keepalives
    }
  };

  sse.onerror = (err) => {
    if (onError) onError(err);
  };

  return () => {
    sse.close();
  };
}

export async function pullModel(modelName: string): Promise<{ status: string; model: string; message?: string; error?: string }> {
  const res = await fetch(`${API_BASE}/ai/pull`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model_name: modelName }),
  });
  if (!res.ok) throw new Error(`Failed to pull model: ${res.statusText}`);
  return res.json();
}

