import React, { useState, useEffect } from 'react';
import { Box, Typography, Stepper, Step, StepLabel, Paper } from '@mui/material';
import axios from 'axios';
import FileUpload from './FileUpload';
import ConfigureTraining from './ConfigureTraining';
import TrainingProgress from './TrainingProgress';

const steps = ['Upload Data', 'Configure Training', 'Start Training'];

const TrainingPipeline = ({ projectId, pipelineId }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [pipelineData, setPipelineData] = useState(null);

    useEffect(() => {
        // Fetch pipeline data
        const fetchPipelineData = async () => {
            try {
                const response = await axios.get(`/api/v1/projects/${projectId}/training/${pipelineId}`);
                setPipelineData(response.data.data);
                
                // Set active step based on pipeline status
                if (response.data.data.status === 'data_uploaded') {
                    setActiveStep(1);
                } else if (response.data.data.status === 'configured') {
                    setActiveStep(2);
                } else if (response.data.data.status === 'training') {
                    setActiveStep(3);
                }
            } catch (error) {
                console.error('Error fetching pipeline data:', error);
            }
        };

        fetchPipelineData();
    }, [projectId, pipelineId]);

    const handleUploadSuccess = (data) => {
        setPipelineData(prev => ({
            ...prev,
            status: 'data_uploaded',
            datasetPath: data.filename
        }));
        setActiveStep(1);
    };

    const handleConfigureSuccess = (data) => {
        setPipelineData(prev => ({
            ...prev,
            status: 'configured',
            configuration: data
        }));
        setActiveStep(2);
    };

    const handleTrainingStart = (data) => {
        setPipelineData(prev => ({
            ...prev,
            status: 'training'
        }));
        setActiveStep(3);
    };

    return (
        <Box sx={{ width: '100%', p: 3 }}>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Stepper activeStep={activeStep}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Paper>

            {activeStep === 0 && (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Upload Training Data
                    </Typography>
                    <FileUpload
                        projectId={projectId}
                        pipelineId={pipelineId}
                        onUploadSuccess={handleUploadSuccess}
                    />
                </Paper>
            )}

            {activeStep === 1 && (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Configure Training
                    </Typography>
                    <ConfigureTraining
                        projectId={projectId}
                        pipelineId={pipelineId}
                        onConfigureSuccess={handleConfigureSuccess}
                    />
                </Paper>
            )}

            {activeStep === 2 && (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Start Training
                    </Typography>
                    <TrainingProgress
                        projectId={projectId}
                        pipelineId={pipelineId}
                        onTrainingStart={handleTrainingStart}
                    />
                </Paper>
            )}
        </Box>
    );
};

export default TrainingPipeline; 