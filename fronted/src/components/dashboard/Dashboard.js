import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <Container>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Welcome, {user?.name}!
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Manage your ML training projects and pipelines
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Projects
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Create and manage your ML projects
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                startIcon={<AddIcon />}
                                onClick={() => navigate('/projects')}
                            >
                                View Projects
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Training Pipelines
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Set up and monitor your model training pipelines
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                startIcon={<AddIcon />}
                                onClick={() => navigate('/projects')}
                            >
                                Create Pipeline
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard; 