import React, { Component } from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Custom Diagnostic Error Boundary
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("Diagnostic Error Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          margin: '40px',
          background: '#fff5f5',
          border: '2px solid #feb2b2',
          borderRadius: '12px',
          color: '#c53030',
          fontFamily: 'monospace',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ marginBottom: '16px', fontSize: '1.5rem' }}>⚠️ Render Crash Detected</h2>
          <p style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '12px' }}>
            {this.state.error?.toString()}
          </p>
          <hr style={{ border: 'none', borderTop: '1px solid #fed7d7', margin: '20px 0' }} />
          <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Stack Trace:</h3>
          <pre style={{
            background: '#fff',
            padding: '16px',
            borderRadius: '6px',
            border: '1px solid #fca5a5',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            fontSize: '0.85rem',
            color: '#742a2a',
            lineHeight: '1.5'
          }}>
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
