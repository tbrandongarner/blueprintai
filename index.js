import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import * as Sentry from '@sentry/browser';
import { AuthProvider } from './authcontext';
import App from './app';

function initApp() {
  const dsn = process.env.REACT_APP_SENTRY_DSN;
  if (dsn) {
    Sentry.init({
      dsn,
      environment: process.env.NODE_ENV,
    });
  }
}

function initRouter() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

function initContext(children) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}

function renderApp() {
  const rootElement = document.getElementById('root');
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      {initContext(initRouter())}
    </React.StrictMode>
  );
}

initApp();
renderApp();