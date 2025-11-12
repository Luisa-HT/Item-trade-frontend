// src/pages/user/UserDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { getMyItems } from '../../services/itemService';
import { getMyBookings, cancelBooking } from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';
import ItemList from '../../components/item/ItemList';
import './UserDashboardPage.css';
import Button from '../../components/common/Button';
import BookingList from "../../components/item/BookingList.jsx";
import Modal from "../../components/common/Modal.jsx";
// import './BookingDetailPage.css'; // Kita 'curi' style dari sini

const UserDashboardPage = () => {
    const { user } = useAuth();
    const [myItems, setMyItems] = useState([]);
    const [myBookings, setMyBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedBooking, setSelectedBooking] = useState(null);

    // ... (useEffect dan handleCancel tetap sama) ...
    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setIsLoading(true);
                const [itemsResponse, bookingsResponse] = await Promise.all([
                    getMyItems(),
                    getMyBookings(),
                ]);
                setMyItems(itemsResponse.data || []);
                setMyBookings(bookingsResponse.data || []);
            } catch (error) {
                console.error('Gagal memuat data dashboard:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadDashboardData();
    }, []);

    const handleCancelMyBooking = async (bookingId) => {
        if (!window.confirm('Apakah kamu yakin ingin membatalkan booking ini?')) {
            return;
        }
        try {
            await cancelBooking(bookingId);
            alert('Booking berhasil dibatalkan.');
            setMyBookings(prev =>
                prev.map(b => b.id === bookingId ? { ...b, isActive: false } : b)
            );
            setSelectedBooking(null);
        } catch (err) {
            console.error('Gagal membatalkan booking:', err);
            alert('Gagal membatalkan booking.');
        }
    };

    // Kita TIDAK PERLU fungsi 'handleRejectRequest' terpisah lagi
    // karena 'item.bookings' masih 'null'
    // Logika 'bookingRequests' tetap aman (menghasilkan array kosong)
    const bookingRequests = myItems.flatMap(item => {
        if (Array.isArray(item.bookings)) {
            return item.bookings.map(booking => ({
                ...booking,
                itemName: item.name
            }));
        }
        return [];
    });


    // --- 👇 INI LOGIKA FILTER YANG DIUBAH 👇 ---
    const pendingItems = myItems.filter(item =>
        item.isApproved === false // 'false' adalah 'Pending'
    );
    const approvedItems = myItems.filter(item =>
        item.isApproved === true // 'true' adalah 'Approved'
    );
    // ----------------------------------------

    // --- Logika pagination sekarang berdasarkan 'approvedItems' ---
    const PAGE_SIZE = 3;
    const startIndex = currentPage * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const displayedItems = approvedItems.slice(startIndex, endIndex);
    const totalPages = Math.ceil(approvedItems.length / PAGE_SIZE);
    const canGoPrev = currentPage > 0;
    const canGoNext = endIndex < approvedItems.length;
    const handlePrevPage = () => { if (canGoPrev) { setCurrentPage(prev => prev - 1); } };
    const handleNextPage = () => { if (canGoNext) { setCurrentPage(prev => prev + 1); } };
    // -----------------------------------------------

    if (isLoading) {
        return <div className="loading-text">Loading Dashboard...</div>;
    }

    return (
        <div className="dashboard-container">
            <h2>Selamat Datang, {user?.username}!</h2>

            {/* 1. SECTION PENDING (Filter baru) */}
            <div className="dashboard-section">
                <h2>Barang Menunggu Persetujuan</h2>
                {pendingItems.length > 0 ? (
                    <ItemList items={pendingItems} className="dashboard-list" showStatus={true} />
                ) : (
                    <p>Tidak ada barang yang menunggu persetujuan.</p>
                )}
            </div>

            {/* 2. SECTION APPROVED (Filter & Judul baru) */}
            <div className="dashboard-section">
                <div className="section-header">
                    <h2>Barang Saya (Sudah Disetujui)</h2>
                    {approvedItems.length > PAGE_SIZE && (
                        <div className="pagination-controls">
                            <Button onClick={handlePrevPage} disabled={!canGoPrev} variant="primary">&lt;</Button>
                            <span>{currentPage + 1} / {totalPages}</span>
                            <Button onClick={handleNextPage} disabled={!canGoNext} variant="primary">&gt;</Button>
                        </div>
                    )}
                </div>
                {displayedItems.length > 0 ? (
                    <ItemList items={displayedItems} className="dashboard-list" showStatus={true} />
                ) : (
                    <p>Kamu belum memiliki barang yang disetujui.</p>
                )}
            </div>

            {/* 3. SECTION BOOKING REQUESTS (Aman, akan menampilkan 0) */}
            <div className="dashboard-section">
                <h2>Booking Requests (Yang Masuk)</h2>
                {bookingRequests.length === 0 ? (
                    <p>Tidak ada permintaan booking untuk barang-barangmu.</p>
                ) : (
                    <ul className="booking-list request-list">
                        {/* ... (Logika map ini aman, karena array-nya kosong) ... */}
                    </ul>
                )}
            </div>

            {/* 4. SECTION MY BOOKINGS (Tidak berubah) */}
            <div className="dashboard-section">
                <h2>Booking Saya (Yang Kamu Buat)</h2>
                <BookingList
                    bookings={myBookings}
                    onViewDetails={(booking) => setSelectedBooking(booking)}
                />
            </div>

            {/* MODAL (Tidak berubah, menggunakan handleCancelMyBooking) */}
            <Modal isOpen={!!selectedBooking} onClose={() => setSelectedBooking(null)}>
                {selectedBooking && (
                    <div className="booking-detail-card modal-version">
                        {/* ... (Konten Modal) ... */}
                        {selectedBooking.isActive && (
                            <div className="booking-detail-actions">
                                <Button variant="danger" onClick={() => handleCancelMyBooking(selectedBooking.id)}>
                                    Batalkan Booking
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default UserDashboardPage;