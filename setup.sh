#!/bin/bash

# Create necessary directories
mkdir -p backend/src/{models,routes,middleware}
mkdir -p frontend/src/{components,pages}

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Create .env files
cd ../backend
cp .env.example .env
cd ../frontend
cp .env.example .env

echo "Project setup completed successfully!"
echo "Please update the .env files with your configuration before starting the application." 