import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ExecuteTransaction.css';

function ExecuteTransaction({ user, setCurrentView }) {
  const [approvedTxs, setApprovedTxs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovedTransactions();
  }, []);

  const fetchApprovedTransactions = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/transactions/approved/list');
      setApprovedTxs(res.data || []);
    } catch (err) {
      console.error('Failed to fetch approved transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const execute = async (transactionId) => {
    const confirm = window.confirm('Are you sure you want to execute this approved transaction?');
    if (!confirm) return;

    try {
      const res = await axios.post(`/transactions/execute/${transactionId}`);
      alert('✅ ' + res.data.message);
      fetchApprovedTransactions(); // Refresh after execution
    } catch (err) {
      alert('❌ ' + (err.response?.data?.error || 'Execution failed'));
    }
  };

  return (
    <div className="execute-container">
      <div className="page-header">
        <h2>🔓 Execute Transactions</h2>
        <button onClick={() => setCurrentView('dashboard')} className="back-button">
          ← Back to Dashboard
        </button>
      </div>

      {loading ? (
        <div className="loading">🔄 Loading approved transactions...</div>
      ) : approvedTxs.length === 0 ? (
        <div className="no-data">📭 No approved transactions available</div>
      ) : (
        <div className="execute-grid">
          {approvedTxs.map((tx) => (
            <div key={tx._id} className="execute-card">
              <div className="tx-header">
                <span className="tx-id">#{tx.transactionId.slice(0, 8)}...</span>
                <span className="tx-amount">₹{tx.amount}</span>
              </div>
              <div className="tx-details">
                <p><strong>Recipient:</strong> {tx.recipient}</p>
                <p><strong>Description:</strong> {tx.description}</p>
                <p><strong>Initiator:</strong> {tx.initiator?.username}</p>
                <p><strong>Created:</strong> {new Date(tx.createdAt).toLocaleString()}</p>
              </div>

              {(user.role === 'admin' || user.id === tx.initiator._id) ? (
                <button 
                  onClick={() => execute(tx.transactionId)}
                  className="execute-button"
                >
                  🚀 Execute
                </button>
              ) : (
                <p className="not-authorized">🔒 Not authorized to execute</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExecuteTransaction;
