import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AuditLogViewer.css';

function AuditLogViewer({ setCurrentView }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get('/audit/logs');
      setLogs(res.data.logs);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    }
  };

  return (
    <div className="audit-container">
      <div className="page-header">
        <h2>🧾 Audit Logs</h2>
        <button onClick={() => setCurrentView('dashboard')} className="back-button">
          ← Back to Dashboard
        </button>
      </div>

      <div className="log-table">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Action</th>
              <th>Target ID</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td>{log.username}</td>
                <td>{log.action}</td>
                <td>{log.targetId || '-'}</td>
                <td>{log.status}</td>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && <div className="no-logs">📭 No activity yet</div>}
      </div>
    </div>
  );
}

export default AuditLogViewer;
