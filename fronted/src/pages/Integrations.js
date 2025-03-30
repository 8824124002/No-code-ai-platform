import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import axios from 'axios';

const INTEGRATION_TYPES = {
  OPENAI: 'openai',
  AWS: 'aws',
  GOOGLE_CLOUD: 'google_cloud',
};

function Integrations() {
  const [integrations, setIntegrations] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [config, setConfig] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/integrations`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIntegrations(response.data);
    } catch (error) {
      setError('Failed to fetch integrations');
      console.error('Error fetching integrations:', error);
    }
  };

  const handleAddIntegration = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/integrations`,
        {
          type: selectedType,
          config,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOpenDialog(false);
      setSuccess('Integration added successfully');
      fetchIntegrations();
    } catch (error) {
      setError('Failed to add integration');
      console.error('Error adding integration:', error);
    }
  };

  const handleDeleteIntegration = async (integrationId) => {
    if (!window.confirm('Are you sure you want to delete this integration?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/integrations/${integrationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess('Integration deleted successfully');
      fetchIntegrations();
    } catch (error) {
      setError('Failed to delete integration');
      console.error('Error deleting integration:', error);
    }
  };

  const renderConfigFields = () => {
    switch (selectedType) {
      case INTEGRATION_TYPES.OPENAI:
        return (
          <TextField
            fullWidth
            label="API Key"
            type="password"
            value={config.apiKey || ''}
            onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
            sx={{ mb: 2 }}
          />
        );
      case INTEGRATION_TYPES.AWS:
        return (
          <>
            <TextField
              fullWidth
              label="Access Key ID"
              value={config.accessKeyId || ''}
              onChange={(e) =>
                setConfig({ ...config, accessKeyId: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Secret Access Key"
              type="password"
              value={config.secretAccessKey || ''}
              onChange={(e) =>
                setConfig({ ...config, secretAccessKey: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Region"
              value={config.region || ''}
              onChange={(e) => setConfig({ ...config, region: e.target.value })}
            />
          </>
        );
      case INTEGRATION_TYPES.GOOGLE_CLOUD:
        return (
          <TextField
            fullWidth
            label="Service Account Key"
            multiline
            rows={4}
            value={config.serviceAccountKey || ''}
            onChange={(e) =>
              setConfig({ ...config, serviceAccountKey: e.target.value })
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Integrations</Typography>
        <Button
          variant="contained"
          onClick={() => setOpenDialog(true)}
        >
          Add Integration
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {integrations.map((integration) => (
          <Grid item xs={12} sm={6} md={4} key={integration._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {integration.type}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Added on: {new Date(integration.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  color="error"
                  onClick={() => handleDeleteIntegration(integration._id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Integration</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Integration Type</InputLabel>
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              label="Integration Type"
            >
              <MenuItem value={INTEGRATION_TYPES.OPENAI}>OpenAI</MenuItem>
              <MenuItem value={INTEGRATION_TYPES.AWS}>AWS</MenuItem>
              <MenuItem value={INTEGRATION_TYPES.GOOGLE_CLOUD}>
                Google Cloud
              </MenuItem>
            </Select>
          </FormControl>
          {renderConfigFields()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddIntegration} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Integrations; 