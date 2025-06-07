import axios from 'axios';
import { LogEntry, LogFilters, LogStats } from '../types';

const API_URL = 'http://localhost:5000/api';

export const logService = {
  uploadLog: async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
  
  getLogs: async (filters: LogFilters = {}): Promise<LogEntry[]> => {
    const params = new URLSearchParams();
    
    if (filters.level) params.append('level', filters.level);
    if (filters.source) params.append('source', filters.source);
    if (filters.startDate) params.append('start_date', filters.startDate);
    if (filters.endDate) params.append('end_date', filters.endDate);
    
    const response = await axios.get<LogEntry[]>(`${API_URL}/logs?${params.toString()}`);
    return response.data;
  },
  
  getStats: async (): Promise<LogStats> => {
    const response = await axios.get<LogStats>(`${API_URL}/stats`);
    return response.data;
  },
};
