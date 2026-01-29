import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, getStoredUser, clearStoredAuth } from '../api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [questions, setQuestions] = useState([]);
  const [replyContent, setReplyContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const data = await api.getAllQuestions();
      setQuestions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (questionId) => {
    const content = replyContent[questionId];
    if (!content?.trim()) return;

    setSubmitting(questionId);
    setError('');

    try {
      await api.replyToQuestion(questionId, content);
      setReplyContent({ ...replyContent, [questionId]: '' });
      loadQuestions();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(null);
    }
  };

  const handleLogout = () => {
    clearStoredAuth();
    navigate('/login');
  };

  const unanswered = questions.filter((q) => !q.reply_content);
  const answered = questions.filter((q) => q.reply_content);

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
        <Link to="/admin" className="active">Reply Questions</Link>
        <Link to="/admin/questions">All Questions</Link>
        <Link to="/admin/users">Users</Link>
      </nav>

      <main>
        {error && <div className="error">{error}</div>}

        <section className="questions-section">
          <h2>Unanswered Questions ({unanswered.length})</h2>
          {loading ? (
            <p>Loading...</p>
          ) : unanswered.length === 0 ? (
            <p className="no-data">No pending questions.</p>
          ) : (
            <div className="questions-list">
              {unanswered.map((q) => (
                <div key={q.id} className="question-card">
                  <div className="question">
                    <div className="question-meta">
                      <strong>{q.user_name}</strong>
                      <span>{q.user_email}</span>
                    </div>
                    <p>{q.content}</p>
                    <span className="date">{new Date(q.created_at).toLocaleString()}</span>
                  </div>
                  <div className="reply-form">
                    <textarea
                      value={replyContent[q.id] || ''}
                      onChange={(e) => setReplyContent({ ...replyContent, [q.id]: e.target.value })}
                      placeholder="Type your reply..."
                      rows={3}
                    />
                    <button
                      onClick={() => handleReply(q.id)}
                      className="btn-primary"
                      disabled={submitting === q.id}
                    >
                      {submitting === q.id ? 'Sending...' : 'Send Reply'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="questions-section">
          <h2>Answered Questions ({answered.length})</h2>
          {answered.length === 0 ? (
            <p className="no-data">No answered questions yet.</p>
          ) : (
            <div className="questions-list">
              {answered.map((q) => (
                <div key={q.id} className="question-card answered">
                  <div className="question">
                    <div className="question-meta">
                      <strong>{q.user_name}</strong>
                      <span>{q.user_email}</span>
                    </div>
                    <p>{q.content}</p>
                    <span className="date">{new Date(q.created_at).toLocaleString()}</span>
                  </div>
                  <div className="reply">
                    <span className="label">Reply by {q.admin_name}:</span>
                    <p>{q.reply_content}</p>
                    <span className="date">{new Date(q.reply_created_at).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
