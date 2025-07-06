import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from '../authcontext.jsx';
import App from '../app.jsx';

function initApp() {
  // Sentry initialization removed - dependency not installed
}

function initRouter() {
  return <App />;
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