import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import QuestionsList from './pages/QuestionsList';
import AdminDashboard from './pages/AdminDashboard';
import AdminQuestionsList from './pages/AdminQuestionsList';
import AdminUsersList from './pages/AdminUsersList';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/questions"
          element={
            <ProtectedRoute requiredRole="user">
              <QuestionsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/questions"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminQuestionsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminUsersList />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
