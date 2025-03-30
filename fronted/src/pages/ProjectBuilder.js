import React, { useState, useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'react-flow-renderer';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';

// Node types
const nodeTypes = {
  input: 'input',
  model: 'model',
  output: 'output',
  api: 'api',
};

// Initial nodes
const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Input Data' },
    position: { x: 250, y: 25 },
  },
  {
    id: '2',
    type: 'model',
    data: { label: 'AI Model' },
    position: { x: 250, y: 125 },
  },
  {
    id: '3',
    type: 'output',
    data: { label: 'Output' },
    position: { x: 250, y: 225 },
  },
];

// Initial edges
const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
];

function ProjectBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = {
        x: event.clientX - 250,
        y: event.clientY - 100,
      };

      const newNode = {
        id: `${nodes.length + 1}`,
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, setNodes]
  );

  return (
    <Box sx={{ height: 'calc(100vh - 100px)' }}>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Components
            </Typography>
            <Card sx={{ mb: 2 }}>
              <CardHeader title="Input" />
              <CardContent>
                <Typography variant="body2">
                  Start your workflow with input data
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ mb: 2 }}>
              <CardHeader title="AI Model" />
              <CardContent>
                <Typography variant="body2">
                  Add AI models for processing
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ mb: 2 }}>
              <CardHeader title="API" />
              <CardContent>
                <Typography variant="body2">
                  Connect to external APIs
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardHeader title="Output" />
              <CardContent>
                <Typography variant="body2">
                  Define output formats
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <Paper sx={{ height: '100%' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onDragOver={onDragOver}
              onDrop={onDrop}
              nodeTypes={nodeTypes}
              fitView
            >
              <Controls />
              <MiniMap />
              <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProjectBuilder; 