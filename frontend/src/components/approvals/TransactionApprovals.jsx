import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TransactionApprovals.css';

function TransactionApprovals({ user, setCurrentView }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const fetchPendingApprovals = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/transactions/approvals/list');
      setTransactions(res.data || []);
    } catch (err) {
      console.error('Failed to load approvals:', err);
    } finally {
      setLoading(false);
    }
  };

  const signTransaction = async (transactionId) => {
    const confirm = window.confirm('Do you want to digitally sign this transaction?');
    if (!confirm) return;

    try {
      const res = await axios.post(`/transactions/approve/${transactionId}`);
      alert('✅ ' + res.data.message);
      fetchPendingApprovals(); // Refresh list
    } catch (err) {
      alert('❌ ' + (err.response?.data?.error || 'Signing failed'));
    }
  };

  return (
    <div className="approval-container">
      <div className="page-header">
        <h2>✅ Transaction Approvals</h2>
        <button onClick={() => setCurrentView('dashboard')} className="back-button">
          ← Back to Dashboard
        </button>
      </div>

      {loading ? (
        <div className="loading">🔄 Loading pending approvals...</div>
      ) : transactions.length === 0 ? (
        <div className="no-data">🎉 No transactions pending your approval</div>
      ) : (
        <div className="approvals-grid">
          {transactions.map((tx) => (
            <div key={tx._id} className="approval-card">
              <div className="tx-header">
                <span className="tx-id">#{tx.transactionId.slice(0, 8)}...</span>
                <span className="tx-amount">₹{tx.amount}</span>
              </div>
              <div className="tx-details">
                <p><strong>Recipient:</strong> {tx.recipient}</p>
                <p><strong>Description:</strong> {tx.description}</p>
                <p><strong>Created:</strong> {new Date(tx.createdAt).toLocaleString()}</p>
                <p><strong>Initiator:</strong> {tx.initiator?.username}</p>
              </div>
              <div className="tx-progress">
                <span>Signatures: {tx.signaturesCount}/{tx.requiredSignatures}</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${(tx.signaturesCount / tx.requiredSignatures) * 100}%` }}
                  ></div>
                </div>
              </div>

              {!tx.signedBy.includes(user.id) && (
                <button 
                  className="sign-button"
                  onClick={() => signTransaction(tx.transactionId)}
                >
                  ✍️ Sign Transaction
                </button>
              )}

              {tx.signedBy.includes(user.id) && (
                <p className="already-signed">✅ You’ve already signed</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TransactionApprovals;
