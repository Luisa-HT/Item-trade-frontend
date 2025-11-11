// src/pages/public/RegisterPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import RegisterForm from '../../components/auth/RegisterForm';
import './AuthPage.css'; // Menggunakan CSS yang sama

const RegisterPage = () => {
    return (
        <div className="auth-page-container">
            <Card className="auth-card">
                <h2 className="auth-title">Buat Akun Baru</h2>
                <p className="auth-subtitle">Daftar Sekarang</p>

                <RegisterForm />

                <div className="auth-footer">
                    Sudah punya akun? <Link to="/login">Login di sini</Link>
                </div>
            </Card>
        </div>
    );
};

export default RegisterPage;