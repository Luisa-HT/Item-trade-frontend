// src/pages/user/BookingDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingById, cancelBooking } from '../../services/bookingService';
import Button from '../../components/common/Button';
import './BookingDetailPage.css'; // Kita akan buat file ini

const BookingDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                setIsLoading(true);
                const response = await getBookingById(id);
                setBooking(response.data);
            } catch (err) {
                console.error('Gagal mengambil detail booking:', err);
                setError('Gagal memuat data booking.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchBooking();
    }, [id]);

    const handleCancel = async () => {
        if (!window.confirm('Apakah kamu yakin ingin membatalkan booking ini?')) {
            return;
        }

        try {
            await cancelBooking(id);
            alert('Booking berhasil dibatalkan.');
            // Refresh halaman untuk melihat status baru
            setBooking(prev => ({ ...prev, isActive: false }));
        } catch (err) {
            console.error('Gagal membatalkan booking:', err);
            alert('Gagal membatalkan booking.');
        }
    };

    if (isLoading) return <div className="loading-text">Loading...</div>;
    if (error) return <div className="error-text">{error}</div>;
    if (!booking) return <div>Booking tidak ditemukan.</div>;

    const statusClass = booking.isActive ? 'active' : 'inactive';

    return (
        <div className="booking-detail-container">
            <h1>Detail Booking</h1>

            <div className="booking-detail-card">
                <div className="booking-detail-header">
                    <h2>{booking.itemName}</h2>
                    <span className={`booking-status ${statusClass}`}>
            {booking.isActive ? 'Aktif' : 'Dibatalkan'}
          </span>
                </div>

                <div className="booking-detail-body">
                    <h3>Informasi Pemilik Barang</h3>
                    <div className="info-grid">
                        <label>Nama:</label>
                        <span>{booking.itemOwner?.name || 'N/A'}</span>

                        <label>Email:</label>
                        <span>{booking.itemOwner?.email || 'N/A'}</span>

                        <label>No. HP:</label>
                        <span>{booking.itemOwner?.phoneNumber || 'N/A'}</span>
                    </div>

                    <h3 className="section-title">Informasi Booking</h3>
                    <div className="info-grid">
                        <label>Tanggal Booking:</label>
                        {/* Format tanggal agar lebih mudah dibaca */}
                        <span>{new Date(booking.bookedAt).toLocaleString('id-ID')}</span>

                        <label>Booking ID:</label>
                        <span className="booking-id">{booking.id}</span>
                    </div>
                </div>

                {booking.isActive && (
                    <div className="booking-detail-actions">
                        <Button variant="danger" onClick={handleCancel}>
                            Batalkan Booking
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingDetailPage;