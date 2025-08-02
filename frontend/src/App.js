import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Dashboard from './components/dashboard/Dashboard';
import TransactionManager from './components/transactions/TransactionManager';
import TransactionApprovals from './components/approvals/TransactionApprovals';
import SecureMessaging from './components/messaging/SecureMessaging';
import ExecuteTransaction from './components/transactions/ExecuteTransaction';
import AuditLogViewer from './components/audit/AuditLogViewer';


axios.defaults.baseURL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('login');

  const fetchUserInfo = useCallback(async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('user'));
      setUser(userInfo);
      setCurrentView('dashboard');
    } catch (error) {
      logout();
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserInfo();
    }
  }, [fetchUserInfo]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setCurrentView('login');
  };

  const renderView = () => {
    switch (currentView) {
      case 'login':
        return <LoginForm setUser={setUser} setCurrentView={setCurrentView} />;
      case 'register':
        return <RegisterForm setCurrentView={setCurrentView} />;
      case 'dashboard':
        return <Dashboard user={user} setCurrentView={setCurrentView} logout={logout} />;
      case 'transactions':
        return <TransactionManager user={user} setCurrentView={setCurrentView} />;
      case 'messaging':
        return <SecureMessaging user={user} setCurrentView={setCurrentView} />;
      case 'approvals':
        return <TransactionApprovals user={user} setCurrentView={setCurrentView} />;
      case 'execute':
        return <ExecuteTransaction user={user} setCurrentView={setCurrentView} />;
      case 'audit':
        return <AuditLogViewer setCurrentView={setCurrentView} />;

      default:
        return <LoginForm setUser={setUser} setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🏦 Secure Banking System</h1>
        {user && (
          <div className="user-info">
            <span>Welcome, {user.username}!</span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        )}
      </header>
      <main className="app-main">
        {renderView()}
      </main>
    </div>
  );
}

export default App;
