import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, getStoredUser, clearStoredAuth } from '../api';

export default function AdminUsersList() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedUser, setExpandedUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await api.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearStoredAuth();
    navigate('/login');
  };

  const filteredUsers = users.filter((u) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      u.full_name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.phone.includes(term)
    );
  });

  const totalQuestions = users.reduce((sum, u) => sum + u.question_count, 0);
  const totalAnswered = users.reduce((sum, u) => sum + u.answered_count, 0);

  return (
    <div className="dashboard admin-dashboard">
      <header>
        <h1>Admin Panel</h1>
        <div className="user-info">
          <span>{user?.full_name}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <Link to="/admin">Reply Questions</Link>
        <Link to="/admin/questions">All Questions</Link>
        <Link to="/admin/users" className="active">Users</Link>
      </nav>

      <main>
        {error && <div className="error">{error}</div>}

        <section className="stats-section">
          <div className="stat-card">
            <span className="stat-value">{users.length}</span>
            <span className="stat-label">Total Users</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{totalQuestions}</span>
            <span className="stat-label">Total Questions</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{totalAnswered}</span>
            <span className="stat-label">Answered</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{totalQuestions - totalAnswered}</span>
            <span className="stat-label">Pending</span>
          </div>
        </section>

        <section className="questions-section">
          <div className="list-header">
            <h2>Registered Users</h2>
          </div>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : filteredUsers.length === 0 ? (
            <p className="no-data">
              {searchTerm ? 'No users match your search.' : 'No users registered yet.'}
            </p>
          ) : (
            <div className="users-list">
              {filteredUsers.map((u) => (
                <div key={u.id} className="user-card">
                  <div
                    className="user-card-header"
                    onClick={() => setExpandedUser(expandedUser === u.id ? null : u.id)}
                  >
                    <div className="user-main-info">
                      <strong>{u.full_name}</strong>
                      <span className="user-email">{u.email}</span>
                    </div>
                    <div className="user-stats">
                      <span className="stat-badge">
                        {u.question_count} questions
                      </span>
                      <span className="stat-badge answered">
                        {u.answered_count} answered
                      </span>
                      <span className="expand-icon">{expandedUser === u.id ? '▼' : '▶'}</span>
                    </div>
                  </div>
                  {expandedUser === u.id && (
                    <div className="user-details">
                      <div className="detail-row">
                        <span className="detail-label">Phone:</span>
                        <span>{u.phone}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Date of Birth:</span>
                        <span>{u.date_of_birth}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Birthday:</span>
                        <span>{u.birthday}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Birth Time:</span>
                        <span>{u.birth_time}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Birth Place:</span>
                        <span>{u.birth_place}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Marital Status:</span>
                        <span>{u.marital_status}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Registered:</span>
                        <span>{new Date(u.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
