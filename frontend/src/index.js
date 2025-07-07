import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

/**
 * Get the root DOM node and initialize the React application.
 */
const root = ReactDOM.createRoot(document.getElementById('root'));
/**
 * Render the main App component inside React.StrictMode.
 */
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
