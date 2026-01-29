import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';

export default function Register() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    date_of_birth: '',
    birthday: '',
    birth_time: '',
    birth_place: '',
    marital_status: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const registerFn = isAdmin ? api.adminRegister : api.userRegister;
      const data = isAdmin
        ? { full_name: formData.full_name, email: formData.email, phone: formData.phone, password: formData.password }
        : formData;
      await registerFn(data);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1>Register</h1>

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
          <label htmlFor="full_name">Full Name</label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            value={formData.full_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        {!isAdmin && (
          <>
            <div className="form-group">
              <label htmlFor="date_of_birth">Date of Birth</label>
              <input
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="birthday">Birthday (Myanmar)</label>
              <input
                id="birthday"
                name="birthday"
                type="text"
                placeholder="e.g., Monday"
                value={formData.birthday}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="birth_time">Birth Time</label>
              <input
                id="birth_time"
                name="birth_time"
                type="time"
                value={formData.birth_time}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="birth_place">Birth Place</label>
              <input
                id="birth_place"
                name="birth_place"
                type="text"
                value={formData.birth_place}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="marital_status">Marital Status</label>
              <select
                id="marital_status"
                name="marital_status"
                value={formData.marital_status}
                onChange={handleChange}
                required
              >
                <option value="">Select...</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
            </div>
          </>
        )}

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p className="auth-link">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
