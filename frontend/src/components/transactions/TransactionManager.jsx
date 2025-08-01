import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TransactionManager.css';

// Transaction Manager Component
function TransactionManager({ user, setCurrentView }) {
  const [activeTab, setActiveTab] = useState('create');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    recipient: '',
    description: ''
  });

  useEffect(() => {
    if (activeTab === 'list') {
      fetchTransactions();
    }
  }, [activeTab]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/transactions/pending/list');
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/transactions/create', newTransaction);
      alert('✅ Transaction created successfully!');
      setNewTransaction({ amount: '', recipient: '', description: '' });
      setActiveTab('list');
    } catch (error) {
      alert('❌ Failed to create transaction: ' + (error.response?.data?.error || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transaction-container">
      <div className="page-header">
        <h2>💰 Transaction Management</h2>
        <button onClick={() => setCurrentView('dashboard')} className="back-button">
          ← Back to Dashboard
        </button>
      </div>

      <div className="tab-navigation">
        <button 
          className={activeTab === 'create' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('create')}
        >
          ➕ Create Transaction
        </button>
        <button 
          className={activeTab === 'list' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('list')}
        >
          📋 View Transactions
        </button>
      </div>

      {activeTab === 'create' && (
        <div className="create-transaction">
          <h3>Create High-Value Transaction</h3>
          <form onSubmit={handleCreateTransaction}>
            <div className="form-group">
              <label>Amount ($):</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({
                  ...newTransaction,
                  amount: e.target.value
                })}
                required
              />
            </div>

            <div className="form-group">
              <label>Recipient Account:</label>
              <input
                type="text"
                value={newTransaction.recipient}
                onChange={(e) => setNewTransaction({
                  ...newTransaction,
                  recipient: e.target.value
                })}
                placeholder="Enter recipient account number"
                required
              />
            </div>

            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({
                  ...newTransaction,
                  description: e.target.value
                })}
                placeholder="Transaction description"
                rows="3"
              />
            </div>

            <div className="security-notice">
              <h4>🔐 Security Notice:</h4>
              <p>This transaction will require <strong>3 out of 5</strong> authorized signatures before execution. Each signature uses RSA digital signing for maximum security.</p>
            </div>

            <button type="submit" disabled={loading} className="submit-button">
              {loading ? '🔄 Creating...' : '🚀 Create Transaction'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'list' && (
        <div className="transaction-list">
          <h3>Pending Transactions</h3>
          {loading ? (
            <div className="loading">🔄 Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="no-data">📭 No pending transactions</div>
          ) : (
            <div className="transactions-grid">
              {transactions.map((tx) => (
                <div key={tx.id} className="transaction-card">
                  <div className="tx-header">
                    <span className="tx-id">#{tx.transactionId.substring(0, 8)}...</span>
                    <span className="tx-amount">${tx.amount.toLocaleString()}</span>
                  </div>
                  <div className="tx-details">
                    <p><strong>Recipient:</strong> {tx.recipient}</p>
                    <p><strong>Initiated by:</strong> {tx.initiator.username}</p>
                    <p><strong>Created:</strong> {new Date(tx.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="tx-progress">
                    <div className="signature-progress">
                      <span>Signatures: {tx.signaturesCount}/{tx.requiredSignatures}</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${(tx.signaturesCount / tx.requiredSignatures) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TransactionManager;