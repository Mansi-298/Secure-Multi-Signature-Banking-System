import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './SecureMessaging.css';

const SecureMessaging = ({ user, setCurrentView }) => {
  const [message, setMessage] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get('/auth/users');
      setUsers(res.data.users.filter(u => u._id !== user._id));
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  }, [user]);

  useEffect(() => {
    fetchUsers();
    fetchInbox();
  }, [fetchUsers]);

  const fetchInbox = async () => {
    try {
      const res = await axios.get('/messaging/received');
      setMessages(res.data.messages);
    } catch (err) {
      console.error('Failed to fetch inbox', err);
    }
  };

  const sendMessage = async () => {
    if (!recipientId || !message) {
      alert('Recipient and message required');
      return;
    }
    try {
      await axios.post('/messaging/send', { recipientId, content: message });
      alert('📤 Message sent securely!');
      setMessage('');
      setRecipientId('');
    } catch (err) {
      alert('❌ ' + (err.response?.data?.error || 'Failed to send message'));
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.post(`/messaging/mark-read/${id}`);
      fetchInbox();
    } catch (err) {
      console.error('Failed to mark message as read');
    }
  };

  return (
    <div className="messaging-container">
      <div className="page-header">
        <h2>🔐 Secure Messaging</h2>
        <button onClick={() => setCurrentView('dashboard')} className="back-button">← Back</button>
      </div>

      <div className="messaging-grid">
        <div className="send-message">
          <h3>📨 Compose Message</h3>
          <select value={recipientId} onChange={(e) => setRecipientId(e.target.value)} required>
            <option value="">-- Select Recipient --</option>
            {users.map(u => (
              <option key={u._id} value={u._id}>{u.username}</option>
            ))}
          </select>
          <textarea
            rows="4"
            placeholder="Write your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>🚀 Send Secure Message</button>
        </div>

        <div className="inbox">
          <h3>📥 Inbox</h3>
          {messages.length === 0 ? (
            <p>No messages</p>
          ) : (
            messages.map((msg) => (
              <div key={msg._id} className={`msg-card ${msg.isRead ? 'read' : 'unread'}`}>
                <p><strong>From:</strong> {msg.sender?.username}</p>
                <p><strong>Received:</strong> {new Date(msg.createdAt).toLocaleString()}</p>
                <p><strong>Decrypted:</strong> {msg.decrypted}</p>
                {!msg.isRead && (
                  <button onClick={() => markAsRead(msg._id)}>✅ Mark as Read</button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SecureMessaging;