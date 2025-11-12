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
    const [currentPage, setCurrentPage] = useState(0);

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
    const PAGE_SIZE = 5; // 5 baris per halaman (lebih cocok untuk tabel)
    const startIndex = currentPage * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;

    // Kita slice array 'pendingItems'
    const displayedItems = pendingItems.slice(startIndex, endIndex);

    const totalPages = Math.ceil(pendingItems.length / PAGE_SIZE);
    const canGoPrev = currentPage > 0;
    const canGoNext = endIndex < pendingItems.length;

    const handlePrevPage = () => {
        if (canGoPrev) { setCurrentPage(prev => prev - 1); }
    };
    const handleNextPage = () => {
        if (canGoNext) { setCurrentPage(prev => prev + 1); }
    };

    if (isLoading) {
        return <div className="loading-text">Loading items...</div>;
    }

    // ...
    return (
        <div className="admin-container">
            <h1>Admin Dashboard - Pending Items</h1>

            <table className="admin-table">
                {/* ... (thead kamu tetap sama) ... */}
                <tbody>
                {/* Cek 'pendingItems.length' untuk pesan "no items" */}
                {pendingItems.length === 0 ? (
                    <tr>
                        <td colSpan="4" className="no-items">Tidak ada item yang perlu disetujui.</td>
                    </tr>
                ) : (
                    // Render 'displayedItems' di sini
                    displayedItems.map(item => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.user?.username || 'User Tidak Dikenal'}</td>
                            <td className="request-message">{item.request}</td>
                            <td className="action-buttons">
                                {/* ... (tombol-tombol kamu tetap sama) ... */}
                                <Button variant="secondary" onClick={() => navigate(`/item/${item.id}`)}>Details</Button>
                                <Button variant="primary" onClick={() => handleApprove(item.id)}>Approve</Button>
                                <Button variant="danger" onClick={() => handleReject(item.id)}>Reject</Button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>

            {/* 👇 TAMBAHKAN PAGINATION FOOTER INI 👇 */}
            {totalPages > 1 && (
                <div className="pagination-footer">
                    <Button
                        onClick={handlePrevPage}
                        disabled={!canGoPrev}
                        variant="secondary"
                    >
                        &lt; Previous
                    </Button>
                    <span>
                  Page {currentPage + 1} of {totalPages}
                </span>
                    <Button
                        onClick={handleNextPage}
                        disabled={!canGoNext}
                        variant="secondary"
                    >
                        Next &gt;
                    </Button>
                </div>
            )}
        </div>
    );
};

export default AdminDashboardPage;