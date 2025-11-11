// src/pages/user/UserDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { getMyItems } from '../../services/itemService';
import {cancelBooking, getMyBookings} from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';
import ItemList from '../../components/item/ItemList'; // Kita pakai ulang komponen ini!
import './UserDashboardPage.css'; // Kita akan buat file ini
import Button from '../../components/common/Button';
import BookingList from "../../components/item/BookingList.jsx";
import Modal from "../../components/common/Modal.jsx";
import {useParams} from "react-router-dom";


const UserDashboardPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [myItems, setMyItems] = useState([]);
    const [myBookings, setMyBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedBooking, setSelectedBooking] = useState(null); // (null = tertutup)

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setIsLoading(true);
                // Panggil kedua API secara bersamaan
                const [itemsResponse, bookingsResponse] = await Promise.all([
                    getMyItems(),
                    getMyBookings()
                ]);

                setMyItems(itemsResponse.data || []);
                setMyBookings(bookingsResponse.data || []); // Asumsi bookings tidak dipaginasi
                console.log(itemsResponse.data, 'itemsResponse.data');
                console.log(bookingsResponse.data, 'bookingsResponse.data');

            } catch (error) {
                console.error('Gagal memuat data dashboard:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    const handleCancel = async () => {
        if (!selectedBooking) return;

        if (!window.confirm('Apakah kamu yakin ingin membatalkan booking ini?')) {
            return;
        }

        try {
            // 2. Gunakan ID dari selectedBooking, BUKAN dari useParams
            await cancelBooking(selectedBooking.id);
            alert('Booking berhasil dibatalkan.');

            // 3. Update state array dengan benar (pakai .map)
            setMyBookings(prevBookings =>
                prevBookings.map(booking =>
                    booking.id === selectedBooking.id
                        ? { ...booking, isActive: false }
                        : booking
                )
            );

            // 4. Tutup modal-nya
            setSelectedBooking(null);

        } catch (err) {
            console.error('Gagal membatalkan booking:', err);
            alert('Gagal membatalkan booking.');
        }
    };

    const PAGE_SIZE = 3; // Hanya 2 item per halaman

    // Logika untuk memotong array
    const startIndex = currentPage * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const displayedItems = myItems.slice(startIndex, endIndex);



    // Logika untuk tombol
    const totalPages = Math.ceil(myItems.length / PAGE_SIZE);
    const canGoPrev = currentPage > 0;
    const canGoNext = endIndex < myItems.length;

    const handlePrevPage = () => {
        if (canGoPrev) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleNextPage = () => {
        if (canGoNext) {
            setCurrentPage(prev => prev + 1);
        }
    };
    if (isLoading) {
        return <div className="loading-text">Loading Dashboard...</div>;
    }

    return (
        <div className="dashboard-container">
            <h2>Selamat Datang, {user?.username}!</h2>

            {/* INI KODE BARU KAMU */}
            <div className="dashboard-section">

                {/* Wrapper baru untuk judul dan tombol */}
                <div className="section-header">
                    <h2>Barang Tukar Saya</h2>

                    {/* Tombol Carousel (Pagination) */}
                    {myItems.length > PAGE_SIZE && ( // Hanya tampilkan jika item > 2
                        <div className="pagination-controls">
                            <Button onClick={handlePrevPage} disabled={!canGoPrev} variant="primary">
                                &lt;
                            </Button>
                            <span>
                                {currentPage + 1} / {totalPages}
                            </span>
                            <Button onClick={handleNextPage} disabled={!canGoNext} variant="primary">
                                &gt;
                            </Button>
                        </div>
                    )}
                </div>

                {/* Gunakan 'displayedItems' di sini, bukan 'myItems' */}
                {displayedItems.length > 0 ? (
                    <ItemList items={displayedItems} className="dashboard-list" />
                ) : (
                    <p>Kamu belum memposting barang apapun.</p>
                )}
            </div>
            <div className="dashboard-section">
                <h3>Booking Saya</h3>
                <BookingList
                    bookings={myBookings}
                    onViewDetails={(booking) => setSelectedBooking(booking)}
                />
                    </div>

                {/* 👇 4. TAMBAHKAN MODAL DI SINI */}
                <Modal isOpen={!!selectedBooking} onClose={() => setSelectedBooking(null)}>
                    {selectedBooking && (
                        // Kita "curi" style dari BookingDetailPage.css
                        <div className="booking-detail-card modal-version">
                            <div className="booking-detail-header">
                                <h2>{selectedBooking.itemName}</h2>
                                <span className={`booking-status ${selectedBooking.isActive ? 'active' : 'inactive'}`}>
                                {selectedBooking.isActive ? 'Aktif' : 'Dibatalkan'}
                                </span>
                            </div>

                            <div className="booking-detail-body">
                                <h3>Informasi Pemilik Barang</h3>
                                <div className="info-grid">
                                    <label>Nama:</label>
                                    <span>{selectedBooking.itemOwner?.name || 'N/A'}</span>

                                    <label>Email:</label>
                                    <span>{selectedBooking.itemOwner?.email || 'N/A'}</span>

                                    <label>No. HP:</label>
                                    <span>{selectedBooking.itemOwner?.phoneNumber || 'N/A'}</span>
                                </div>

                                <h3 className="section-title">Informasi Booking</h3>
                                <div className="info-grid">
                                    <label>Tanggal Booking:</label>
                                    <span>{new Date(selectedBooking.bookedAt).toLocaleString('id-ID')}</span>

                                    <label>Booking ID:</label>
                                    <span className="booking-id">{selectedBooking.id}</span>

                                    {/*{selectedBooking.isActive && (*/}
                                    {/*    // <div className="booking-detail-actions">*/}
                                    {/*        <Button className="cancel-button" variant="danger" onClick={handleCancel}>*/}
                                    {/*            Batalkan Booking*/}
                                    {/*        </Button>*/}
                                    {/*    // </div>*/}
                                    {/*)}*/}
                                </div>
                                <div>
                                {selectedBooking.isActive && (
                                    // <div className="booking-detail-actions">
                                    <Button className="cancel-button" variant="danger" onClick={handleCancel}>
                                        Batalkan Booking
                                    </Button>
                                    // </div>
                                )}
                                </div>
                            </div>


                        </div>
                    )}
                </Modal>
            </div>
    );
};

export default UserDashboardPage;