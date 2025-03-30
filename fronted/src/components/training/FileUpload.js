import React, { useState } from 'react';
import { Box, Button, Typography, CircularProgress, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const FileUpload = ({ projectId, pipelineId, onUploadSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'text/csv') {
            setSelectedFile(file);
            setError(null);
        } else {
            setError('Please select a CSV file');
            setSelectedFile(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Please select a file first');
            return;
        }

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post(
                `/api/v1/projects/${projectId}/training/${pipelineId}/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            setSuccess(true);
            setSelectedFile(null);
            if (onUploadSuccess) {
                onUploadSuccess(response.data);
            }
        } catch (error) {
            setError(error.response?.data?.error || 'Error uploading file');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box sx={{ textAlign: 'center', p: 3 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    File uploaded successfully!
                </Alert>
            )}
            <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                sx={{ mb: 2 }}
            >
                Select CSV File
                <VisuallyHiddenInput
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                />
            </Button>
            {selectedFile && (
                <Typography variant="body2" sx={{ mb: 2 }}>
                    Selected file: {selectedFile.name}
                </Typography>
            )}
            <Button
                variant="contained"
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                sx={{ mt: 2 }}
            >
                {uploading ? (
                    <>
                        <CircularProgress size={24} sx={{ mr: 1 }} />
                        Uploading...
                    </>
                ) : (
                    'Upload'
                )}
            </Button>
        </Box>
    );
};

export default FileUpload; 