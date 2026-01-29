const API_BASE = 'http://localhost:3000/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  let response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, config);
  } catch (err) {
    throw new Error('Cannot connect to server. Make sure backend is running on port 3000.');
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Server returned non-JSON response. Check if backend is running.');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export const api = {
  // Auth
  adminRegister: (data) => request('/auth/admin/register', { method: 'POST', body: JSON.stringify(data) }),
  adminLogin: (data) => request('/auth/admin/login', { method: 'POST', body: JSON.stringify(data) }),
  userRegister: (data) => request('/auth/user/register', { method: 'POST', body: JSON.stringify(data) }),
  userLogin: (data) => request('/auth/user/login', { method: 'POST', body: JSON.stringify(data) }),

  // Questions (User)
  submitQuestion: (content) => request('/questions', { method: 'POST', body: JSON.stringify({ content }) }),
  getMyQuestions: () => request('/questions'),

  // Admin
  getAllQuestions: () => request('/admin/questions'),
  getAllUsers: () => request('/admin/users'),
  replyToQuestion: (id, content) => request(`/admin/questions/${id}/reply`, { method: 'POST', body: JSON.stringify({ content }) }),
};

export function getStoredUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function setStoredAuth(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

export function clearStoredAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
