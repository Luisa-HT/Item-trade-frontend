// src/components/auth/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import './AuthForm.css'; // Kita akan gunakan CSS yang sama untuk Login & Register

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Hapus error sebelumnya

        try {
            // Panggil fungsi login dari AuthContext
            await login({ username, password });

            // Jika berhasil, arahkan ke dashboard
            navigate('/dashboard'); // Atau '/' untuk home
        } catch (err) {
            // Jika AuthContext melempar error, tangkap di sini
            console.error(err);
            setError('Login gagal. Cek kembali username dan password kamu.');
        }
    };

    return (

        <form className="auth-form" onSubmit={handleSubmit}>
            {error && <p className="form-error">{error}</p>}

            <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>

                {/* Kita butuh wrapper agar bisa menaruh tombol di dalamnya */}
                <div className="password-input-wrapper">
                    <input
                        id="password"
                        // Tipe input sekarang dinamis
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {/* Tombol untuk Show/Hide */}
                    <button
                        type="button" // PENTING: agar tidak submit form
                        className="password-toggle-btn"
                        onClick={() => setShowPassword(prev => !prev)}
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                </div>
            </div>

            <Button type="submit" variant="primary" className="submit-button">
                Login
            </Button>
        </form>
    );
};

export default LoginForm;