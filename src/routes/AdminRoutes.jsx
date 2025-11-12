// src/routes/AdminRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
    const { isAuthenticated, user, isLoading } = useAuth();
    console.log('ADMIN ROUTE CHECK:', user);
    if (isLoading) {
        return <div>Loading...</div>; // Tampilkan loading
    }

    // Cek jika user login DAN rolenya adalah 0 (Admin)
    // Kita cek 'Admin' dan 0 untuk jaga-jaga
    const isAdmin = user && (user.role === 'Admin' || user.role === 0);

    if (!isAuthenticated || !isAdmin) {
        // Jika bukan admin, tendang dia ke dashboard-nya sendiri
        return <Navigate to="/dashboard" replace />;
    }

    // Jika dia adalah admin, izinkan dia masuk
    return <Outlet />;
};

export default AdminRoute;