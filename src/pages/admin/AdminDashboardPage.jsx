// src/pages/admin/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { getPendingItems, approveItem, rejectItem } from '../../services/adminService';
import Button from '../../components/common/Button';
import './AdminDashboardPage.css'; // Kita akan buat file ini

const AdminDashboardPage = () => {
    const [pendingItems, setPendingItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fungsi untuk mengambil data
    const fetchPending = async () => {
        try {
            setIsLoading(true);
            const response = await getPendingItems();
            setPendingItems(response.data.data || []); // Asumsi datanya di .data
        } catch (err) {
            console.error('Gagal mengambil pending items:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Ambil data saat halaman di-load
    useEffect(() => {
        fetchPending();
    }, []);

    // Handler untuk tombol
    const handleApprove = async (id) => {
        try {
            await approveItem(id);
            // Hapus item dari state (agar UI update instan)
            setPendingItems(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            console.error('Gagal approve item:', err);
            alert('Gagal approve item.');
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm('Yakin ingin menolak item ini?')) return;
        try {
            await rejectItem(id);
            // Hapus item dari state
            setPendingItems(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            console.error('Gagal reject item:', err);
            alert('Gagal reject item.');
        }
    };

    if (isLoading) {
        return <div className="loading-text">Loading items...</div>;
    }

    return (
        <div className="admin-container">
            <h1>Admin Dashboard - Pending Items</h1>

            <table className="admin-table">
                <thead>
                <tr>
                    <th>Nama Item</th>
                    <th>Diposting Oleh</th>
                    <th>Pesan Request</th>
                    <th>Aksi</th>
                </tr>
                </thead>
                <tbody>
                {pendingItems.length === 0 ? (
                    <tr>
                        <td colSpan="4" className="no-items">Tidak ada item yang perlu disetujui.</td>
                    </tr>
                ) : (
                    pendingItems.map(item => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.user?.username || 'User Tidak Dikenal'}</td>
                            <td className="request-message">{item.request}</td>
                            <td className="action-buttons">
                                <Button variant="primary" onClick={() => handleApprove(item.id)}>
                                    Approve
                                </Button>
                                <Button variant="danger" onClick={() => handleReject(item.id)}>
                                    Reject
                                </Button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboardPage;