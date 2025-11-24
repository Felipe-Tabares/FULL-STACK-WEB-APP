import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// React 18 usa createRoot en lugar de ReactDOM.render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// NOTA EDUCATIVA:
// - React.StrictMode ayuda a identificar problemas potenciales
// - React usa un DOM Virtual para optimizar las actualizaciones
// - Solo los componentes que cambian se re-renderizan, no toda la página

