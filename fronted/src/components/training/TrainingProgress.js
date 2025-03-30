import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Typography,
    LinearProgress,
    Paper,
    Grid,
    Alert,
    CircularProgress
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import axios from 'axios';

const TrainingProgress = ({ projectId, pipelineId, onTrainingStart }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);
    const [metrics, setMetrics] = useState(null);
    const [status, setStatus] = useState('idle');

    useEffect(() => {
        let interval;
        if (status === 'training') {
            interval = setInterval(fetchProgress, 5000);
        }
        return () => clearInterval(interval);
    }, [status]);

    const fetchProgress = async () => {
        try {
            const response = await axios.get(
                `/api/v1/projects/${projectId}/training/${pipelineId}`
            );
            const { status, metrics } = response.data.data;
            setStatus(status);
            setMetrics(metrics);
            
            if (status === 'completed' || status === 'failed') {
                if (onTrainingStart) {
                    onTrainingStart(response.data.data);
                }
            }
        } catch (error) {
            console.error('Error fetching progress:', error);
        }
    };

    const handleStartTraining = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                `/api/v1/projects/${projectId}/training/${pipelineId}/start`
            );
            setStatus('training');
            if (onTrainingStart) {
                onTrainingStart(response.data.data);
            }
        } catch (error) {
            setError(error.response?.data?.error || 'Error starting training');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'success';
            case 'failed':
                return 'error';
            case 'training':
                return 'primary';
            default:
                return 'default';
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Training Status
                        </Typography>
                        <Typography
                            color={getStatusColor(status)}
                            sx={{ mb: 2 }}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Typography>

                        {status === 'training' && (
                            <Box sx={{ width: '100%', mb: 2 }}>
                                <LinearProgress variant="indeterminate" />
                            </Box>
                        )}

                        {metrics && (
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2">
                                        Training Accuracy
                                    </Typography>
                                    <Typography variant="h6">
                                        {(metrics.accuracy * 100).toFixed(2)}%
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2">
                                        Training Loss
                                    </Typography>
                                    <Typography variant="h6">
                                        {metrics.loss.toFixed(4)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2">
                                        Validation Accuracy
                                    </Typography>
                                    <Typography variant="h6">
                                        {(metrics.validationAccuracy * 100).toFixed(2)}%
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2">
                                        Validation Loss
                                    </Typography>
                                    <Typography variant="h6">
                                        {metrics.validationLoss.toFixed(4)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        startIcon={<PlayArrowIcon />}
                        onClick={handleStartTraining}
                        disabled={loading || status === 'training'}
                    >
                        {loading ? (
                            <>
                                <CircularProgress size={24} sx={{ mr: 1 }} />
                                Starting...
                            </>
                        ) : (
                            'Start Training'
                        )}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default TrainingProgress; 