import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import axios from 'axios';
import reportWebVitals from './reportWebVitals';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:8080/api/v1';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals(); 