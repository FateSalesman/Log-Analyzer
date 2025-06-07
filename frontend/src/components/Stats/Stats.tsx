import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { logService } from '../../services/api';
import { LogStats } from '../../types';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Stats: React.FC = () => {
  const [stats, setStats] = useState<LogStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await logService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setError('Failed to load statistics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const getRandomColor = (opacity = 1) => {
    const r = Math.floor(Math.random() * 200 + 55);
    const g = Math.floor(Math.random() * 200 + 55);
    const b = Math.floor(Math.random() * 200 + 55);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!stats) return null;

  const levelData = {
    labels: stats.levels.map(item => item.name),
    datasets: [
      {
        label: 'Logs by Level',
        data: stats.levels.map(item => item.count),
        backgroundColor: stats.levels.map(() => getRandomColor(0.7)),
        borderColor: stats.levels.map(() => getRandomColor(1)),
        borderWidth: 1,
      },
    ],
  };

  const sourceData = {
    labels: stats.sources.map(item => item.name),
    datasets: [
      {
        label: 'Logs by Source',
        data: stats.sources.map(item => item.count),
        backgroundColor: stats.sources.map(() => getRandomColor(0.7)),
        borderColor: stats.sources.map(() => getRandomColor(1)),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Log Statistics
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
        <Box sx={{ flex: '1 1 45%', minWidth: 300 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Logs by Level
              </Typography>
              <Box sx={{ height: 300 }}>
                <Pie data={levelData} options={options} />
              </Box>
            </CardContent>
          </Card>
        </Box>
        
        <Box sx={{ flex: '1 1 45%', minWidth: 300 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Logs by Source
              </Typography>
              <Box sx={{ height: 300 }}>
                <Bar data={sourceData} options={options} />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
    </Box>
  );
};

export default Stats;
