// src/pages/admin/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { getPendingItems, approveItem, rejectItem } from '../../services/adminService';
import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom'; // <-- 1. Pastikan ini di-import
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
    const [pendingItems, setPendingItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate(); // <-- 2. Panggil hook-nya

    // Fungsi untuk mengambil data (sudah benar)
    useEffect(() => {
        const fetchPending = async () => {
            try {
                setIsLoading(true);
                const response = await getPendingItems();
                // Logika baru kamu: 'isApproved: false' adalah pending
                setPendingItems(response.data.filter(item => item.isApproved === false) || []);
            } catch (err) {
                console.error('Gagal mengambil pending items:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPending();
    }, []);

    // 👇 3. KEMBALIKAN FUNGSI HANDLER INI
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

                            {/* 👇 4. UBAH KOLOM AKSI MENJADI SEPERTI INI (3 TOMBOL) 👇 */}
                            <td className="action-buttons">
                                <Button
                                    variant="secondary"
                                    onClick={() => navigate(`/item/${item.id}`)}
                                >
                                    Details
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={() => handleApprove(item.id)}
                                >
                                    Approve
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => handleReject(item.id)}
                                >
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