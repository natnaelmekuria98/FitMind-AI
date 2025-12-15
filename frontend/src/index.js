import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import './index.css';
import App from './App';

// Get the Clerk Publishable Key from environment variables
// For Create React App, use REACT_APP_ prefix
const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  console.error('❌ Missing Clerk Publishable Key!');
  console.error('Please add REACT_APP_CLERK_PUBLISHABLE_KEY to your .env file in the frontend directory');
  console.error('Then restart your development server (npm start)');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {clerkPubKey ? (
      <ClerkProvider publishableKey={clerkPubKey}>
    <App />
      </ClerkProvider>
    ) : (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        flexDirection: 'column',
        color: 'white',
        backgroundColor: '#0f172a',
        fontFamily: 'system-ui'
      }}>
        <h1 style={{ color: '#ef4444', marginBottom: '1rem' }}>⚠️ Configuration Error</h1>
        <p style={{ color: '#cbd5e1', textAlign: 'center', maxWidth: '500px' }}>
          Missing Clerk Publishable Key. Please add <code style={{ color: '#60a5fa' }}>REACT_APP_CLERK_PUBLISHABLE_KEY</code> to your <code style={{ color: '#60a5fa' }}>.env</code> file in the frontend directory and restart the server.
        </p>
      </div>
    )}
  </React.StrictMode>
);

