import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useAuth } from './hooks/useAuth.js';
import { Spinner } from './components/ui/Spinner.jsx';
import { Navbar } from './components/layout/Navbar.jsx';
import { Footer } from './components/layout/Footer.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

const App = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="center-screen center-screen--full">
        <Spinner size="lg" label="Loading session..." />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="app-shell">
          <Navbar />
          <main className="app-main">
            <AppRoutes />
          </main>
          <Footer />
        </div>
        <ToastContainer position="top-right" autoClose={3500} newestOnTop />
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
