// React application entry point
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Error boundary for catching React errors
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
    // Redirect to homepage on critical errors
    if (error.message && (error.message.includes('404') || error.message.includes('Failed to fetch'))) {
      window.location.href = '/AVECapstone/';
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ textAlign: 'center' }}>
            <h1>Something went wrong</h1>
            <p>Redirecting to homepage...</p>
            <a href="/AVECapstone/">Go to Home</a>
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

