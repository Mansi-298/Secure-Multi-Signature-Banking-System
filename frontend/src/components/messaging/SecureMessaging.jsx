
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SecureMessaging.css';

const SecureMessaging = ({ user, setCurrentView }) => {
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser._id);
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.users.filter(u => u._id !== user._id));
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/messaging/received', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(res.data.messages || []);
    } catch (err) {
      console.error('Failed to fetch conversations', err);
    }
  };

  const fetchMessages = async (recipientId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/messaging/received', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userMessages = res.data.messages.filter(msg => 
        msg.sender._id === recipientId || msg.recipient === recipientId
      );
      setMessages(userMessages);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!selectedUser || !message.trim()) {
      alert('Please select a recipient and enter a message');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/messaging/send', { 
        recipientId: selectedUser._id, 
        content: message.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessage('');
      fetchMessages(selectedUser._id);
      alert('📤 Message sent securely!');
    } catch (err) {
      console.error('Send message error:', err);
      alert('❌ ' + (err.response?.data?.error || 'Failed to send message'));
    }
  };

  const selectUser = (selectedUser) => {
    setSelectedUser(selectedUser);
  };

  return (
    <div className="messaging-container">
      <div className="page-header">
        <h2>🔐 Secure Messaging</h2>
        <button onClick={() => setCurrentView('dashboard')} className="back-button">
          ← Back to Dashboard
        </button>
      </div>

      <div className="encryption-notice">
        <span className="icon">🔒</span>
        <div>
          <strong>End-to-End Encrypted</strong>
          <p>All messages are encrypted using RSA-AES hybrid encryption. Only you and the recipient can read them.</p>
        </div>
      </div>

      <div className="messaging-layout">
        {/* Contacts Panel */}
        <div className="contacts-panel">
          <div className="contacts-header">
            <h3>💬 Contacts</h3>
            <span className="contact-count">{users.length} users</span>
          </div>
          
          <div className="contacts-list">
            {users.length === 0 ? (
              <div className="no-contacts">
                <p>👥 No other users found</p>
                <small>Register more users to start messaging</small>
              </div>
            ) : (
              users.map((contact) => (
                <div 
                  key={contact._id}
                  className={`contact-item ${selectedUser?._id === contact._id ? 'selected' : ''}`}
                  onClick={() => selectUser(contact)}
                >
                  <div className="contact-avatar">
                    {contact.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="contact-info">
                    <h4>{contact.username}</h4>
                    <p>{contact.email}</p>
                    <small>👤 {contact.role}</small>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Panel */}
        <div className="chat-panel">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                <div className="chat-avatar">
                  {selectedUser.username.charAt(0).toUpperCase()}
                </div>
                <div className="chat-info">
                  <h3>{selectedUser.username}</h3>
                  <p>🔐 End-to-end encrypted • {selectedUser.email}</p>
                </div>
              </div>

              {/* Messages Container */}
              <div className="messages-container">
                {messages.length === 0 ? (
                  <div className="no-messages">
                    <div className="icon">💬</div>
                    <p>No messages yet</p>
                    <small>Start the conversation by sending a secure message</small>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div 
                      key={msg._id} 
                      className={`message ${msg.sender._id === user._id ? 'sent' : 'received'}`}
                    >
                      <div className="message-bubble">
                        {msg.decrypted || msg.content || 'Encrypted message'}
                      </div>
                      <div className="message-time">
                        {new Date(msg.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <div className="message-input-container">
                <form onSubmit={sendMessage} className="message-input-form">
                  <textarea
                    className="message-input"
                    rows="1"
                    placeholder={`Send a secure message to ${selectedUser.username}...`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(e);
                      }
                    }}
                  />
                  <button 
                    type="submit" 
                    className="send-button"
                    disabled={!message.trim()}
                  >
                    🚀 Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              <div className="icon">💬</div>
              <p>Select a contact to start messaging</p>
              <small>Choose someone from the contacts list to begin a secure conversation</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecureMessaging;
