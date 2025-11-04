import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { loginService } from '../../services/authService';
import './Auth.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { loginAction } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError('Email dan password tidak boleh kosong.');
      setLoading(false);
      return;
    }
    
    try {
      const response = await loginService(email, password); 

      await loginAction(response.access_token);

      setLoading(false);
      navigate('/books');
    
    } catch (err: any) {
      setLoading(false);
      
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'Login gagal. Periksa kembali email dan password Anda.');
      }
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="auth-form">
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-invalid={!!error}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-invalid={!!error}
          />
        </div>
        
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
      <div className="auth-switch-link">
        <p>
          Belum punya akun? <Link to="/register">Daftar di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;