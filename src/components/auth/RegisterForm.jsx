// src/components/auth/RegisterForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import './AuthForm.css'; // Menggunakan CSS yang sama dengan LoginForm

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        name: '',
        address: '',
        phoneNumber: ''
    });
    const [error, setError] = useState(null);
    const { register } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    // Satu handler untuk semua input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Nanti kamu bisa tambahkan validasi "confirm password" di sini

        try {
            await register(formData); // Panggil fungsi register dari context

            // Arahkan ke dashboard setelah berhasil
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError('Pendaftaran gagal. Pastikan semua data diisi dengan benar.');
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            {error && <p className="form-error">{error}</p>}

            <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-wrapper">
                    <input
                        id="password"
                        name="password"
                        // Tipe input sekarang dinamis
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
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
                <label htmlFor="name">Nama Lengkap</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="address">Alamat</label>
                <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="phoneNumber">Nomor HP</label>
                <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                />
            </div>

            <Button type="submit" variant="primary" className="submit-button">
                Daftar
            </Button>
        </form>
    );
};

export default RegisterForm;