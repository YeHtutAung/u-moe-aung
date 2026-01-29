import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, getStoredUser, clearStoredAuth } from '../api';

export default function UserDashboard() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [newQuestion, setNewQuestion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await api.submitQuestion(newQuestion);
      setNewQuestion('');
      setSuccess('Question submitted successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    clearStoredAuth();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <header>
        <h1>Dashboard</h1>
        <div className="user-info">
          <span>{user?.full_name}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <Link to="/dashboard" className="active">Ask Question</Link>
        <Link to="/questions">My Questions</Link>
      </nav>

      <main>
        <section className="ask-section">
          <h2>Ask a Question</h2>
          <form onSubmit={handleSubmit}>
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Type your question here..."
              rows={4}
              required
            />
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Question'}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
