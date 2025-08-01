import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Dashboard Component
function Dashboard({ user, setCurrentView, logout }) {
  const [stats, setStats] = useState({
    pendingTransactions: 0,
    unreadMessages: 0,
    approvalsPending: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch pending transactions
      const txResponse = await axios.get('/transactions/pending/list');
      setStats(prev => ({
        ...prev,
        pendingTransactions: txResponse.data.transactions.length
      }));

      // Fetch unread messages
      const msgResponse = await axios.get('/messaging/received');
      const unreadCount = msgResponse.data.messages.filter(msg => !msg.isRead).length;
      setStats(prev => ({
        ...prev,
        unreadMessages: unreadCount
      }));
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>🏠 Dashboard</h2>
        <p>Welcome to your secure banking system, {user.username}!</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>📊 System Status</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">{stats.pendingTransactions}</span>
              <span className="stat-label">Pending Transactions</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.unreadMessages}</span>
              <span className="stat-label">Unread Messages</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.approvalsPending}</span>
              <span className="stat-label">Awaiting Approval</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <h3>🚀 Quick Actions</h3>
        <div className="action-grid">
          <button 
            onClick={() => setCurrentView('transactions')}
            className="action-card"
          >
            <span className="action-icon">💰</span>
            <span className="action-title">Manage Transactions</span>
            <span className="action-desc">Create and view high-value transactions</span>
          </button>

          <button 
            onClick={() => setCurrentView('approvals')}
            className="action-card"
          >
            <span className="action-icon">✅</span>
            <span className="action-title">Transaction Approvals</span>
            <span className="action-desc">Sign and approve pending transactions</span>
          </button>

          <button 
            onClick={() => setCurrentView('messaging')}
            className="action-card"
          >
            <span className="action-icon">🔒</span>
            <span className="action-title">Secure Messaging</span>
            <span className="action-desc">Send encrypted messages</span>
          </button>

            <button 
            onClick={() => setCurrentView('execute')}
            className="action-card"
            >
            <span className="action-icon">🚀</span>
            <span className="action-title">Execute Transaction</span>
            <span className="action-desc">Run approved transactions securely</span>
            </button>

            <button 
              onClick={() => setCurrentView('audit')}
              className="action-card"
            >
              <span className="action-icon">🧾</span>
              <span className="action-title">Audit Logs</span>
              <span className="action-desc">View all user activity and transaction history</span>
            </button>


        </div>
      </div>

      <div className="security-info">
        <h3>🔐 Security Information</h3>
        <div className="security-features">
          <div className="feature-item">
            <span className="feature-icon">🔑</span>
            <div>
              <strong>RSA 2048-bit Encryption</strong>
              <p>Your private keys are encrypted with military-grade RSA encryption</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⏱️</span>
            <div>
              <strong>TOTP Authentication</strong>
              <p>Time-based one-time passwords prevent unauthorized access</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎯</span>
            <div>
              <strong>Multi-Signature Approval</strong>
              <p>High-value transactions require multiple authorized signatures</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🛡️</span>
            <div>
              <strong>Replay Attack Protection</strong>
              <p>Unique nonces prevent replay and man-in-the-middle attacks</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;