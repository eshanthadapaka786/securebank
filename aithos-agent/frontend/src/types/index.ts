export type TabType = 'overview' | 'workspace' | 'timeline' | 'scanner' | 'audit' | 'settings';

export interface HealthStatus {
  backend: {
    status: string;
    version: string;
    protocol: string;
    message: string;
  };
  privacy_engine: {
    status: string;
    mode: string;
    patterns_loaded: string[];
    in_memory_only: boolean;
  };
  ai_model: {
    available: boolean;
    status_text: string;
    endpoint: string;
    selected_model: string;
    installed_models: string[];
    last_error?: string | null;
  };
  fakebank: {
    connected: boolean;
    status_code: string;
    target_url: string;
    message: string;
    last_checked: string;
    details?: Record<string, any>;
  };
  task_metrics: {
    total: number;
    running: number;
    completed: number;
    blocked: number;
    failed: number;
    cancelled: number;
  };
}

export interface TaskEvent {
  event_id: string;
  task_id: string;
  timestamp: string;
  stage: string;
  operation: string;
  explanation: string;
  why_needed?: string;
  status: 'SUCCESS' | 'RUNNING' | 'BLOCKED' | 'WARNING' | 'FAILED' | 'INFO';
  details: Record<string, any>;
}

export interface AgentTask {
  task_id: string;
  prompt: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'BLOCKED' | 'FAILED' | 'CANCELLED';
  created_at: string;
  started_at?: string | null;
  completed_at?: string | null;
  action_type: string;
  risk_level: string;
  privacy_summary: {
    total_entities_masked?: number;
    detection_counts?: Record<string, number>;
    checksum?: string;
    categories_detected?: string[];
  };
  sanitized_prompt: string;
  events: TaskEvent[];
  final_response: string;
  execution_summary: Record<string, any>;
  error_message?: string | null;
}

export interface SafeMetadataItem {
  placeholder: string;
  category: string;
  confidence: string;
  field_name: string;
}

export interface PrivacyScanResponse {
  sanitized_text: string;
  detection_counts: Record<string, number>;
  total_entities_masked: number;
  checksum: string;
  safe_metadata: SafeMetadataItem[];
  zero_raw_leak_verified: boolean;
}

export interface AuditLogEntry {
  event_id: string;
  timestamp: string;
  event_type: string;
  category: string;
  summary: string;
  status: string;
  details: Record<string, any>;
  task_id?: string | null;
}

export interface SystemSettings {
  fakebank_url: string;
  fakebank_status: {
    connected: boolean;
    status_code: string;
    target_url: string;
    message: string;
    last_checked: string;
    details?: Record<string, any>;
  };
  ollama_endpoint: string;
  ollama_model: string;
  ollama_status: {
    available: boolean;
    status_text: string;
    endpoint: string;
    selected_model: string;
    installed_models: string[];
    last_error?: string | null;
  };
  approved_actions: Record<string, string>;
  disallowed_actions: Record<string, string>;
}
