import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// import { Buffer } from 'buffer';
// import process from 'process';

// // Ensure global variables are set for compatibility
// globalThis.Buffer = Buffer;
// globalThis.process = process;
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
