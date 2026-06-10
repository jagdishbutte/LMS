import { Component } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import DailyLogPage from './DailyLogPage';
import DashboardPage from './DashboardPage';
import ExpensesPage from './ExpensesPage';
import JournalPage from './JournalPage';
import AnalyticsPage from './AnalyticsPage';
import AdminPage from './AdminPage';

/* Reset scroll position when navigating between pages */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/* Friendly fallback instead of a blank screen if a page crashes */
class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-shell--auth">
          <div className="botanical-overlay" />
          <div className="card card--auth" style={{ textAlign: 'center' }}>
            <h1 className="card__title">Something went wrong</h1>
            <p className="card__subtitle">
              Sorry about that — a quick refresh should fix it.
            </p>
            <button
              className="btn btn--primary"
              onClick={() => { this.setState({ hasError: false }); window.location.assign('/'); }}
            >
              Back to Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/daily-log" element={<DailyLogPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
