import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Typography,
    Alert,
    CircularProgress
} from '@mui/material';
import axios from 'axios';

const ConfigureTraining = ({ projectId, pipelineId, onConfigureSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        configuration: {
            modelType: 'resnet',
            learningRate: 0.001,
            epochs: 10,
            batchSize: 32,
            optimizer: 'adam',
            validationSplit: 0.2
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.put(
                `/api/v1/projects/${projectId}/training/${pipelineId}`,
                formData
            );

            if (onConfigureSuccess) {
                onConfigureSuccess(response.data.data);
            }
        } catch (error) {
            setError(error.response?.data?.error || 'Error updating configuration');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Pipeline Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        multiline
                        rows={2}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                        Training Configuration
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>Model Type</InputLabel>
                        <Select
                            name="configuration.modelType"
                            value={formData.configuration.modelType}
                            onChange={handleChange}
                            label="Model Type"
                        >
                            <MenuItem value="resnet">ResNet</MenuItem>
                            <MenuItem value="vgg">VGG</MenuItem>
                            <MenuItem value="efficientnet">EfficientNet</MenuItem>
                            <MenuItem value="yolo">YOLO</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>Optimizer</InputLabel>
                        <Select
                            name="configuration.optimizer"
                            value={formData.configuration.optimizer}
                            onChange={handleChange}
                            label="Optimizer"
                        >
                            <MenuItem value="adam">Adam</MenuItem>
                            <MenuItem value="sgd">SGD</MenuItem>
                            <MenuItem value="rmsprop">RMSprop</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Learning Rate"
                        name="configuration.learningRate"
                        value={formData.configuration.learningRate}
                        onChange={handleChange}
                        inputProps={{ step: 0.0001 }}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Epochs"
                        name="configuration.epochs"
                        value={formData.configuration.epochs}
                        onChange={handleChange}
                        inputProps={{ min: 1 }}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Batch Size"
                        name="configuration.batchSize"
                        value={formData.configuration.batchSize}
                        onChange={handleChange}
                        inputProps={{ min: 1 }}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Validation Split"
                        name="configuration.validationSplit"
                        value={formData.configuration.validationSplit}
                        onChange={handleChange}
                        inputProps={{ step: 0.1, min: 0, max: 1 }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{ mt: 2 }}
                    >
                        {loading ? (
                            <>
                                <CircularProgress size={24} sx={{ mr: 1 }} />
                                Saving...
                            </>
                        ) : (
                            'Save Configuration'
                        )}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ConfigureTraining; 