export interface LogEntry {
  id: number;
  timestamp: string;
  level: string;
  message: string;
  source: string;
  created_at: string;
}

export interface LogStats {
  levels: Array<{ name: string; count: number }>;
  sources: Array<{ name: string; count: number }>;
}

export interface LogFilters {
  level?: string;
  source?: string;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
}
