import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { isEmptyError, logError } from '@/utils/error';

// Global error handler for uncaught errors
window.onerror = (message, source, lineno, colno, error) => {
  if (isEmptyError(error)) return;

  logError('GlobalError', error, {
    message,
    source,
    lineno,
    colno
  });
};

// Global handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  if (isEmptyError(event.reason)) return;

  logError('UnhandledRejection', event.reason);
});

// Global handler for uncaught exceptions
window.addEventListener('error', (event) => {
  if (isEmptyError(event.error)) return;

  logError('UncaughtException', event.error, {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
});

createRoot(document.getElementById("root")!).render(<App />);