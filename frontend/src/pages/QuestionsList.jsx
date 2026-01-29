import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, getStoredUser, clearStoredAuth } from '../api';

export default function QuestionsList() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const data = await api.getMyQuestions();
      setQuestions(data);
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

  const filteredQuestions = questions.filter((q) => {
    if (filter === 'answered') return q.reply_content;
    if (filter === 'pending') return !q.reply_content;
    return true;
  });

  const answeredCount = questions.filter((q) => q.reply_content).length;
  const pendingCount = questions.filter((q) => !q.reply_content).length;

  return (
    <div className="dashboard">
      <header>
        <h1>My Questions</h1>
        <div className="user-info">
          <span>{user?.full_name}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <Link to="/dashboard">Ask Question</Link>
        <Link to="/questions" className="active">My Questions</Link>
      </nav>

      <main>
        {error && <div className="error">{error}</div>}

        <section className="questions-section">
          <div className="list-header">
            <h2>Questions List</h2>
            <div className="filter-tabs">
              <button
                className={filter === 'all' ? 'active' : ''}
                onClick={() => setFilter('all')}
              >
                All ({questions.length})
              </button>
              <button
                className={`filter-answered ${filter === 'answered' ? 'active' : ''}`}
                onClick={() => setFilter('answered')}
              >
                Answered ({answeredCount})
              </button>
              <button
                className={`filter-pending ${filter === 'pending' ? 'active' : ''}`}
                onClick={() => setFilter('pending')}
              >
                Pending ({pendingCount})
              </button>
            </div>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : filteredQuestions.length === 0 ? (
            <p className="no-data">
              {filter === 'all'
                ? 'No questions yet. Go to Ask Question to submit your first question!'
                : `No ${filter} questions.`}
            </p>
          ) : (
            <div className="questions-list">
              {filteredQuestions.map((q) => (
                <div key={q.id} className={`question-card ${q.reply_content ? 'answered' : ''}`}>
                  <div className="question">
                    <div className="question-header">
                      <span className={`status-badge ${q.reply_content ? 'status-answered' : 'status-pending'}`}>
                        {q.reply_content ? 'Answered' : 'Pending'}
                      </span>
                      <span className="date">{new Date(q.created_at).toLocaleString()}</span>
                    </div>
                    <p>{q.content}</p>
                  </div>
                  {q.reply_content ? (
                    <div className="reply">
                      <span className="label">Reply from {q.admin_name}:</span>
                      <p>{q.reply_content}</p>
                      <span className="date">{new Date(q.reply_created_at).toLocaleString()}</span>
                    </div>
                  ) : (
                    <div className="pending">
                      <span>Awaiting reply...</span>
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
