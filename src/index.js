import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Asegúrate de tener este archivo o elimínalo si no lo usas
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);