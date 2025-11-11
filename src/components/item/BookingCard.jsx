// src/components/booking/BookingCard.jsx
import React from 'react';
// import { Link } from 'react-router-dom'; // <-- Hapus Link
import './BookingCard.css';

/**
 * @param {Object} props
 * @param {Object} props.booking - Objek booking.
 * @param {Function} props.onClick - Fungsi yang dipanggil saat kartu diklik.
 */
const BookingCard = ({ booking, onClick }) => {
    const statusClass = booking.isActive ? 'active' : 'inactive';

    return (
        // Ganti <Link> menjadi <div onClick>
        <div className="booking-card" onClick={onClick}>
            <div className="booking-card-content">
                <h3 className="booking-card-title">{booking.itemName}</h3>

                <div className="booking-card-info">
                    <span className="info-label">Pemilik:</span>
                    <span>{booking.itemOwner?.name || 'N/A'}</span>
                </div>

                <div className="booking-card-info">
                    <span className="info-label">Status:</span>
                    <span className={`booking-status ${statusClass}`}>
            {booking.isActive ? 'Aktif' : 'Tidak Aktif'}
          </span>
                </div>
            </div>

            <span className="booking-card-details">Lihat Detail</span>
        </div>
    );
};

export default BookingCard;