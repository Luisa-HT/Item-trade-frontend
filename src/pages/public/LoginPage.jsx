// src/pages/public/LoginPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import LoginForm from '../../components/auth/LoginForm';
import './AuthPage.css'; // Kita akan gunakan CSS yang sama

const LoginPage = () => {
    return (
        <div className="auth-page-container">
            <Card className="auth-card">
                <h2 className="auth-title">Login</h2>
                <p className="auth-subtitle">Selamat datang kembali!</p>

                <LoginForm />

                <div className="auth-footer">
                    Belum punya akun? <Link to="/register">Daftar di sini</Link>
                </div>
            </Card>
        </div>
    );
};

export default LoginPage;