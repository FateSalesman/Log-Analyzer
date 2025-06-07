import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Chip,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Refresh as RefreshIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { logService } from '../../services/api';
import { LogEntry, LogFilters } from '../../types';
// Format date to YYYY-MM-DD HH:MM:SS
const formatDate = (date: Date) => {
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const LogViewer: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<LogFilters>({});
  const [availableLevels, setAvailableLevels] = useState<string[]>([]);
  const [availableSources, setAvailableSources] = useState<string[]>([]);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const [logsData, statsData] = await Promise.all([
        logService.getLogs(filters),
        logService.getStats(),
      ]);
      
      setLogs(logsData);
      setAvailableLevels(statsData.levels.map(l => l.name));
      setAvailableSources(statsData.sources.map(s => s.name));
    } catch (err) {
      console.error('Failed to fetch logs:', err);
      setError('Failed to load logs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const handleFilterChange = (field: keyof LogFilters, value: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      [field]: value || undefined,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const getLogLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error':
        return 'error';
      case 'warn':
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      case 'debug':
        return 'default';
      default:
        return 'primary';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel id="level-filter-label">Level</InputLabel>
          <Select
            labelId="level-filter-label"
            value={filters.level || ''}
            label="Level"
            onChange={(e: SelectChangeEvent) => handleFilterChange('level', e.target.value as string)}
          >
            <MenuItem value="">All Levels</MenuItem>
            {availableLevels.map(level => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel id="source-filter-label">Source</InputLabel>
          <Select
            labelId="source-filter-label"
            value={filters.source || ''}
            label="Source"
            onChange={(e: SelectChangeEvent) => handleFilterChange('source', e.target.value as string)}
          >
            <MenuItem value="">All Sources</MenuItem>
            {availableSources.map(source => (
              <MenuItem key={source} value={source}>
                {source}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          size="small"
          type="date"
          label="From"
          InputLabelProps={{ shrink: true }}
          value={filters.startDate || ''}
          onChange={e => handleFilterChange('startDate', e.target.value)}
        />

        <TextField
          size="small"
          type="date"
          label="To"
          InputLabelProps={{ shrink: true }}
          value={filters.endDate || ''}
          onChange={e => handleFilterChange('endDate', e.target.value)}
        />

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', ml: 'auto' }}>
          <TextField
            size="small"
            placeholder="Search logs..."
            value={filters.searchTerm || ''}
            onChange={e => handleFilterChange('searchTerm', e.target.value)}
          />
          <Tooltip title="Refresh">
            <IconButton onClick={fetchLogs} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Clear Filters">
            <IconButton onClick={clearFilters} disabled={Object.keys(filters).length === 0}>
              <FilterIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>Level</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Message</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No logs found. Try adjusting your filters.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map(log => (
                  <TableRow key={log.id} hover>
                    <TableCell>
                      {formatDate(new Date(log.timestamp))}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.level}
                        size="small"
                        color={getLogLevelColor(log.level) as any}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{log.source}</TableCell>
                    <TableCell sx={{ whiteSpace: 'pre-wrap' }}>{log.message}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default LogViewer;
