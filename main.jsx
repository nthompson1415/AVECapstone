// React application entry point
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Error boundary for catching React rendering errors (non-aggressive)
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React error caught:', error, errorInfo);
    // Don't auto-redirect - let user see the error or navigate manually
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <h1>Something went wrong</h1>
            <p>An error occurred while rendering the application.</p>
            <a href="/AVECapstone/" style={{ color: '#4F46E5', textDecoration: 'underline' }}>Go to Home</a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter basename="/AVECapstone">
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)

