import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLogin.css';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid username or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <p className="admin-login__eyebrow">Curatd Concepts</p>
        <h1 className="admin-login__title">Admin Portal</h1>
        <p className="admin-login__subtitle">Sign in to manage property listings.</p>

        <form className="admin-login__form" onSubmit={handleSubmit}>
          <label className="admin-login__label" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            className="admin-login__input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoFocus
          />

          <label className="admin-login__label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="admin-login__input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          {error && <p className="admin-login__error">{error}</p>}

          <button type="submit" className="btn-primary admin-login__submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
