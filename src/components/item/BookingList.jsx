// src/components/booking/BookingList.jsx
import React from 'react';
import BookingCard from './BookingCard';
import './BookingList.css';

// 👇 Tambahkan { onViewDetails }
const BookingList = ({ bookings, onViewDetails }) => {
    return (
        <div className="booking-list">
            {bookings.length === 0 ? (
                <p className="no-bookings-text">Kamu belum melakukan booking apapun.</p>
            ) : (
                bookings.map(booking => (
                    <BookingCard
                        key={booking.id}
                        booking={booking}
                        onClick={() => onViewDetails(booking)}
                    />
                ))
            )}
        </div>
    );
};

export default BookingList;