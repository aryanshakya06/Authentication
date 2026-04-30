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
      <div className="flex min-h-screen items-center justify-center bg-page">
        <Spinner size="lg" label="Loading session..." />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col bg-page text-fg">
          <Navbar />
          <main className="flex-1">
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
