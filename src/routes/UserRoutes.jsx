// src/routes/UserRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Komponen ini adalah "penjaga" untuk rute-rute privat.
 * Ia akan me-render halaman (via <Outlet />) jika user sudah login.
 * Jika tidak, ia akan mengarahkan user ke halaman /login.
 */
const UserRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    // 1. Tampilkan loading jika context masih mengecek token
    if (isLoading) {
        // Nanti kita bisa ganti ini dengan <Spinner />
        return <div>Loading...</div>;
    }

    // 2. Jika tidak loading DAN tidak login, tendang ke /login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // 3. Jika lolos, render halaman yang diminta (misal: /dashboard)
    return <Outlet />;
};

export default UserRoute;