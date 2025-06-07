import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Typography, Container, Box, Tabs, Tab, Snackbar, Alert } from '@mui/material';
import { Upload as UploadIcon, Assessment as StatsIcon, ListAlt as LogsIcon } from '@mui/icons-material';
import Uploader from './components/Uploader/Uploader';
import LogViewer from './components/LogViewer/LogViewer';
import Stats from './components/Stats/Stats';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

// Tab panel component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleUploadSuccess = () => {
    setSnackbar({
      open: true,
      message: 'Log file uploaded successfully!',
      severity: 'success',
    });
    // Refresh logs and stats after a short delay
    setTimeout(() => {
      // This will trigger a refresh in child components
      setActiveTab(prev => prev);
    }, 500);
  };

  const handleError = (message: string) => {
    setSnackbar({
      open: true,
      message,
      severity: 'error',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Log Analyzer
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              aria-label="log analyzer tabs"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Upload" icon={<UploadIcon />} iconPosition="start" {...a11yProps(0)} />
              <Tab label="Logs" icon={<LogsIcon />} iconPosition="start" {...a11yProps(1)} />
              <Tab label="Statistics" icon={<StatsIcon />} iconPosition="start" {...a11yProps(2)} />
            </Tabs>
          </Box>

          <TabPanel value={activeTab} index={0}>
            <Uploader 
              onUploadSuccess={handleUploadSuccess} 
              onError={handleError} 
            />
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            <LogViewer />
          </TabPanel>
          <TabPanel value={activeTab} index={2}>
            <Stats />
          </TabPanel>
        </Container>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
