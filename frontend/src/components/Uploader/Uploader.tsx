import React, { useState } from 'react';
import { Button, Box, Typography, CircularProgress } from '@mui/material';
import { Upload as UploadIcon } from '@mui/icons-material';
import { logService } from '../../services/api';

interface UploaderProps {
  onUploadSuccess: () => void;
  onError: (error: string) => void;
}

const Uploader: React.FC<UploaderProps> = ({ onUploadSuccess, onError }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.log')) {
      onError('Please upload a .log file');
      return;
    }

    setIsUploading(true);
    try {
      await logService.uploadLog(file);
      onUploadSuccess();
    } catch (error) {
      console.error('Upload failed:', error);
      onError('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset the input value to allow re-uploading the same file
      event.target.value = '';
    }
  };

  return (
    <Box
      sx={{
        border: '2px dashed',
        borderColor: 'primary.main',
        borderRadius: 2,
        p: 4,
        textAlign: 'center',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
    >
      <input
        accept=".log"
        style={{ display: 'none' }}
        id="log-upload"
        type="file"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      <label htmlFor="log-upload">
        <Box display="flex" flexDirection="column" alignItems="center">
          <UploadIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {isUploading ? 'Uploading...' : 'Upload Log File'}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Drag and drop a .log file here, or click to browse
          </Typography>
          {isUploading && (
            <Box mt={2}>
              <CircularProgress size={24} />
            </Box>
          )}
        </Box>
      </label>
    </Box>
  );
};

export default Uploader;
