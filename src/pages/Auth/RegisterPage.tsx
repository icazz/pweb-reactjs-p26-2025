import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import { registerService } from '../../services/authService';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validasi Sisi Klien (Sudah Benar)
    if (!username ||!email || !password || !confirmPassword) {
      setError('Semua field tidak boleh kosong.');
      setLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.');
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Format email tidak valid.');
      setLoading(false);
      return;
    }

    try {
      // Kirim request registrasi ke API
      await registerService(email, password, username);
      setLoading(false);
      alert('Registrasi berhasil! Silakan login.');
      navigate('/login'); 
    
    } catch (err: any) {
      setLoading(false);
      if (err.response && err.response.data && err.response.data.message){
        setError(err.response.data.message);
      } else {
        setError(err.message || 'Registrasi gagal. Coba lagi.');
      }
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister} className="auth-form">
        
        {error && (
          <div className="error-message">{error}</div>
        )}
        
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
            minLength={6} 
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Konfirmasi Password:</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        
        {/* --- 4. Conditional Rendering untuk Loading State [cite: 43, 44] --- */}
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Loading...' : 'Register'}
        </button>
      </form>
      <div className="auth-switch-link">
        <p>
          Sudah punya akun? <Link to="/login">Login di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;