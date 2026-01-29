import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, setStoredAuth } from '../api';

export default function Login() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loginFn = isAdmin ? api.adminLogin : api.userLogin;
      const data = await loginFn({ email, password });
      setStoredAuth(data.token, data.user);
      navigate(isAdmin ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1>Login</h1>

      <div className="role-toggle">
        <button
          type="button"
          className={!isAdmin ? 'active' : ''}
          onClick={() => setIsAdmin(false)}
        >
          User
        </button>
        <button
          type="button"
          className={isAdmin ? 'active' : ''}
          onClick={() => setIsAdmin(true)}
        >
          Admin
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="auth-link">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
