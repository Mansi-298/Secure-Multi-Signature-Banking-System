
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AuditLogViewer.css';

function AuditLogViewer({ setCurrentView }) {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    action: '',
    status: '',
    user: '',
    dateFrom: '',
    dateTo: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(10);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [logs, filters]);

  const fetchLogs = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/audit/logs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(res.data.logs || []);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
      // You could add a toast notification here
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyFilters = () => {
    let filtered = logs;

    if (filters.action) {
      filtered = filtered.filter(log => 
        log.action.toLowerCase().includes(filters.action.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter(log => 
        log.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    if (filters.user) {
      filtered = filtered.filter(log => 
        log.username && log.username.toLowerCase().includes(filters.user.toLowerCase())
      );
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(log => 
        new Date(log.timestamp) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(log => 
        new Date(log.timestamp) <= new Date(filters.dateTo + 'T23:59:59')
      );
    }

    setFilteredLogs(filtered);
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      action: '',
      status: '',
      user: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  const getActionIcon = (action) => {
    const iconMap = {
      'LOGIN': '🔐',
      'LOGIN_FAILED': '❌',
      'REGISTER': '👤',
      'TX_CREATE': '💰',
      'TX_APPROVE': '✅',
      'TX_EXECUTE': '🚀',
      'MSG_SEND': '📤',
      'MSG_READ': '📖',
      'LOGOUT': '🚪',
      'default': '📋'
    };
    return (
      <span className="action-icon" style={{ 
        display: 'inline-block', 
        animation: 'bounce 2s infinite',
        fontSize: '1.2em'
      }}>
        {iconMap[action] || iconMap.default}
      </span>
    );
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'success': return 'status-success';
      case 'failure': case 'failed': return 'status-error';
      case 'pending': return 'status-pending';
      default: return 'status-info';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    };
  };

  const getUniqueValues = (key) => {
    const values = logs.map(log => log[key]).filter(Boolean);
    return [...new Set(values)];
  };

  // Pagination logic
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Summary statistics
  const summary = {
    total: logs.length,
    success: logs.filter(log => log.status === 'success').length,
    failed: logs.filter(log => log.status === 'failure' || log.status === 'failed').length,
    today: logs.filter(log => {
      const today = new Date().toDateString();
      return new Date(log.timestamp).toDateString() === today;
    }).length
  };

  if (loading) {
    return (
      <div className="audit-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading audit logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="audit-container">
      <div className="page-header">
        <h2>🛡️ System Audit Logs</h2>
        <button onClick={() => setCurrentView('dashboard')} className="back-button">
          ← Back to Dashboard
        </button>
      </div>

      {/* Summary Statistics */}
      <div className="audit-summary">
        <div className="summary-item">
          <span className="summary-number">{summary.total}</span>
          <span className="summary-label">Total Events</span>
        </div>
        <div className="summary-item">
          <span className="summary-number">{summary.success}</span>
          <span className="summary-label">Successful</span>
        </div>
        <div className="summary-item">
          <span className="summary-number">{summary.failed}</span>
          <span className="summary-label">Failed</span>
        </div>
        <div className="summary-item">
          <span className="summary-number">{summary.today}</span>
          <span className="summary-label">Today</span>
        </div>
      </div>

      {/* Filters */}
      <div className="audit-controls">
        <div className="filter-section">
          <div className="filter-group">
            <label>Action</label>
            <select
              value={filters.action}
              onChange={(e) => handleFilterChange('action', e.target.value)}
            >
              <option value="">All Actions</option>
              {getUniqueValues('action').map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="success">Success</option>
              <option value="failure">Failure</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="filter-group">
            <label>User</label>
            <input
              type="text"
              placeholder="Search by username..."
              value={filters.user}
              onChange={(e) => handleFilterChange('user', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>From Date</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>To Date</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            />
          </div>
        </div>

        <div className="filter-buttons">
          <button onClick={clearFilters} className="clear-button">
            Clear Filters
          </button>
          <button 
            onClick={() => fetchLogs(true)} 
            className="filter-button"
            disabled={refreshing}
            style={{ opacity: refreshing ? 0.7 : 1 }}
          >
            {refreshing ? '🔄 Refreshing...' : '🔄 Refresh Logs'}
          </button>
        </div>
      </div>

      {/* Audit Logs List */}
      <div className="audit-list">
        {currentLogs.length === 0 ? (
          <div className="no-logs">
            <div className="icon">📭</div>
            <p>No audit logs found matching your criteria</p>
          </div>
        ) : (
          currentLogs.map((log, index) => {
            const timestamp = formatTimestamp(log.timestamp);
            return (
              <div 
                key={index} 
                className={`audit-item ${selectedLog === index ? 'selected' : ''}`}
                onClick={() => setSelectedLog(selectedLog === index ? null : index)}
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  cursor: 'pointer'
                }}
              >
                <div className="audit-header">
                  <div className="audit-action">
                    {getActionIcon(log.action)} {log.action}
                    <span className={`audit-status ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                  </div>
                  <div className="audit-timestamp">
                    {timestamp.date} at {timestamp.time}
                  </div>
                </div>
                
                <div className="audit-details" style={{
                  maxHeight: selectedLog === index ? '500px' : '150px',
                  transition: 'max-height 0.3s ease-in-out'
                }}>
                  <div><strong>User:</strong> <span className="audit-user">{log.username || 'System'}</span></div>
                  {log.targetId && <div><strong>Target ID:</strong> {log.targetId}</div>}
                  <div><strong>User ID:</strong> {log.userId || 'N/A'}</div>
                  {selectedLog === index && (
                    <>
                      <div><strong>Timestamp:</strong> {new Date(log.timestamp).toLocaleString()}</div>
                      <div><strong>Action Type:</strong> {log.action}</div>
                      <div><strong>Status:</strong> {log.status}</div>
                    </>
                  )}
                </div>
                {selectedLog !== index && (
                  <div style={{ 
                    textAlign: 'center', 
                    color: '#6b7280', 
                    fontSize: '0.8rem',
                    marginTop: '0.5rem'
                  }}>
                    Click to view more details ↓
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={currentPage === index + 1 ? 'active' : ''}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuditLogViewer;
