// src/pages/public/ItemDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItemById, deleteItem } from '../../services/itemService';
import { createBooking } from '../../services/bookingService'; // Kita siapkan untuk tombol booking
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import PlaceholderImage from '../../assets/placeholder.jpg';
import './ItemDetailPage.css';
import { approveItem, rejectItem } from '../../services/adminService';


const ItemDetailPage = () => {
    const { id } = useParams(); // Mengambil 'id' dari URL (misal: /item/123)
    const [item, setItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isBookingLoading, setIsBookingLoading] = useState(false); // Loading untuk tombol
    const [error, setError] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    useEffect(() => {
        const fetchItem = async () => {
            try {
                setIsLoading(true); // Selalu set loading di awal
                const response = await getItemById(id);
                setItem(response.data);
                console.log(response.data,'response');
                setCurrentImageIndex(0);
            } catch (err) {
                console.error(err);
                // Ini adalah error 500 yang kamu sebutkan
                setError('Gagal memuat detail item. Backend mungkin sedang bermasalah.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchItem();
    }, [id]); // Ambil data lagi jika ID di URL berubah

    const handleApprove = async () => {
        try {
            await approveItem(id);
            alert('Item disetujui!');
            navigate('/admin'); // Kembalikan admin ke dashboard-nya
        } catch (err) {
            console.error('Gagal approve:', err);
            alert('Gagal approve.');
        }
    };

    const handleReject = async () => {
        if (window.confirm('Yakin ingin menolak (menghapus) item ini?')) {
            try {
                await rejectItem(id);
                alert('Item ditolak dan dihapus.');
                navigate('/admin'); // Kembalikan admin ke dashboard-nya
            } catch (err) {
                console.error('Gagal reject:', err);
                alert('Gagal reject.');
            }
        }
    };

    const handleBookingClick = async () => {
        if (!isAuthenticated) {
            alert('Kamu harus login untuk melakukan booking.');
            return;
        }
        // Hanya buka modal konfirmasi request
        setIsRequestModalOpen(true);
    };
    const handleBookingConfirm = async () => {
        setIsBookingLoading(true); // Tampilkan loading di tombol modal
        try {
            // Panggil API createBooking
            await createBooking(item.id, {});

            // Jika berhasil:
            setIsRequestModalOpen(false); // Tutup Modal 1
            setIsContactModalOpen(true);  // Buka Modal 2

        } catch (err) {
            console.error(err);
            alert('Gagal mengajukan booking. Coba lagi.');
        } finally {
            setIsBookingLoading(false); // Sembunyikan loading
        }
    };
    const handleCopy = () => {
        if (ownerPhone !== 'Kontak tidak tersedia') {
            navigator.clipboard.writeText(ownerPhone).then(() => {
                // This runs after the text is copied
                setIsCopied(true);
                // Reset the button text after 2 seconds
                setTimeout(() => {
                    setIsCopied(false);
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        }
    };
    const handlePrevImage = () => {
        if (!item?.media || item.media.length === 0) return;
        setCurrentImageIndex(prevIndex =>
            // Jika di gambar pertama, lompat ke gambar terakhir
            prevIndex === 0 ? item.media.length - 1 : prevIndex - 1
        );
    };

    const handleNextImage = () => {
        if (!item?.media || item.media.length === 0) return;
        setCurrentImageIndex(prevIndex =>
            // Jika di gambar terakhir, lompat ke gambar pertama
            prevIndex === item.media.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handleThumbnailClick = (index) => {
        setCurrentImageIndex(index);
    };

    // Tampilkan loading atau error
    if (isLoading) return <div className="loading-text">Loading item...</div>;
    if (error) return <div className="error-text">{error}</div>;
    if (!item) return <div>Item tidak ditemukan.</div>;

    const BACKEND_URL = 'https://server.welazure.dev';

    const ownerPhone = item?.user?.phoneNumber || 'Kontak tidak tersedia';
    const images = item?.media || [];
    const currentMedia = images[currentImageIndex];
    const mainImageUrl = images.length > 0
        ? BACKEND_URL + currentMedia.filePath
        : PlaceholderImage;//'https://via.placeholder.com/400?text=No+Image'; // Gambar placeholder
    // const mainImageUrl = PlaceholderImage;
    console.log(mainImageUrl, 'mainImageUrl');
    console.log(images, 'images');
    const handleDelete = async () => {
        if (window.confirm('Apakah kamu yakin ingin menghapus item ini? Ini tidak bisa dibatalkan.')) {
            try {
                await deleteItem(id);
                alert('Item berhasil dihapus.');
                navigate('/dashboard'); // Arahkan user kembali ke dashboard
            } catch (err) {
                console.error('Gagal menghapus item:', err);
                alert('Gagal menghapus item.');
            }
        }
    };
    const isOwner = user?.id === item?.user?.id;
    const isAdmin = user && (user.role === 'Admin' || user.role === 0);
    const isPending = item?.isApproved === false; // 'false' = pending

    return (
        <div className="detail-page-container">
            {/* Bagian Atas: Gambar & Info */}
            <div className="detail-top-section">

                {/* Kolom Kiri: Gambar */}
                <div className="detail-image-section">

                    {/* Wrapper baru untuk gambar utama + tombol */}
                    <div className="carousel-main">
                        <img
                            src={mainImageUrl}
                            alt={item.name}
                            className="main-image"
                        />
                        {/* Tampilkan tombol hanya jika ada > 1 gambar */}
                        {images.length > 1 && (
                            <>
                                <button className="carousel-button-prev" onClick={handlePrevImage}>&#10094;</button>
                                <button className="carousel-button-next" onClick={handleNextImage}>&#10095;</button>
                            </>
                        )}
                    </div>

                    {/* Tampilkan thumbnail hanya jika ada > 1 gambar */}
                    {images.length > 1 && (
                        <div className="thumbnail-gallery">
                            {images.map((img, index) => (
                                <img
                                    key={img.id || index}
                                    src={BACKEND_URL + img.filePath} // <-- KODE BARU
                                    alt={`${item.name} thumbnail ${index + 1}`}
                                    className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                                    onClick={() => handleThumbnailClick(index)}
                                />
                            ))}
                        </div>
                    )}
                </div>
                {/* Kolom Kanan: Info & Aksi */}
                <div className="detail-info-section">

                    {/* 1. Judul ada di dalam .detail-info-section */}
                    <h1 className="detail-title">{item.name}</h1>

                    {/* 2. Spesifikasi ada di dalam .detail-info-section */}
                    <div className="detail-bottom-section">
                        <div className="specs-section">
                            <h3>Spesifikasi Produk</h3>
                            <div className="specs-grid">
                                <div className="spec-item">
                                    <label>Kategori</label>
                                    <span>{item.category?.name || 'Tidak ada'}</span>
                                </div>
                                <div className="spec-item">
                                    <label>Pemilik</label>
                                    <div className="spec-item-owner">
                                        <span className="username">{item.user?.username || 'Tidak ada'}</span>
                                    </div>
                                </div>
                                <div className="spec-item">
                                    <label>Status</label>
                                    <span>{item.status || 'Tersedia'}</span>
                                </div>
                                <div className="spec-item">
                                    <label>Request</label>
                                    <span>{item.request || 'Tidak Ada'}</span>
                                </div>
                                <div className="spec-item">
                                    <label>Address</label>
                                    <span>{item.user?.address || 'Tidak Ada'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Deskripsi ada di dalam .detail-info-section */}
                    <div className="description-section">
                        <h3>Deskripsi Produk</h3>
                        <p>{item.description}</p>
                    </div>
                    <div className="description-section">
                        <h3>Request</h3>
                        <span>{item.request || 'Tidak Ada'}</span>
                    </div>

                    {/* 4. Tombol Aksi ada di dalam .detail-info-section */}
                    <div className="action-button">

                        {isAdmin && isPending ? (
                            // 1. Tampilan untuk ADMIN (saat item PENDING)
                            // KITA CEK INI PERTAMA!
                            <div className="admin-actions">
                                <Button variant="primary" onClick={handleApprove}>
                                    Approve
                                </Button>
                                <Button variant="danger" onClick={handleReject}>
                                    Reject
                                </Button>
                            </div>
                        ) : isOwner ? (
                            // 2. Tampilan untuk PEMILIK BARANG (jika BUKAN admin & pending)
                            <div className="owner-actions">
                                <Button variant="secondary" onClick={() => navigate(`/item/edit/${id}`)}>
                                    Edit Item
                                </Button>
                                <Button variant="danger" onClick={handleDelete}>
                                    Hapus Item Ini
                                </Button>
                            </div>
                        ) : (
                            // 3. Tampilan untuk USER LAIN (publik)
                            item.isApproved === true ? (
                                <Button variant="primary" onClick={handleBookingClick}>
                                    Ajukan Penukaran
                                </Button>
                            ) : (
                                <p className="pending-notice">Item ini sedang menunggu persetujuan.</p>
                            )
                        )}
                    </div> {/* <-- Akhir dari .action-button */}

                </div> {/* <-- Akhir dari .detail-info-section */}
            </div> {/* <-- Akhir dari .detail-top-section */}
            <Modal isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)}>
                <div className="request-modal-content">
                    <h2 style={{ marginTop: 0 }}>Konfirmasi Penukaran</h2>
                    <p>Pemilik barang ini memiliki request penukaran spesifik:</p>
                    {/* Box untuk menampilkan pesan request */}
                    <div className="request-box">
                        <p>{item.request || 'Tidak ada request spesifik.'}</p>
                    </div>
                    <p style={{marginTop: '1.5rem', fontWeight: 500}}>
                        Lanjutkan untuk mengajukan booking dan melihat kontak pemilik?
                    </p>
                    {/* Tombol aksi untuk modal ini */}
                    <div className="request-modal-actions">
                        <Button
                            variant="secondary"
                            onClick={() => setIsRequestModalOpen(false)}
                            disabled={isBookingLoading}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleBookingConfirm}
                            disabled={isBookingLoading}
                        >
                            {isBookingLoading ? 'Memproses...' : 'Ya, Lanjutkan'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* --- 6. MODAL 2 (Info Kontak) --- */}
            <Modal
                isOpen={isContactModalOpen} // <-- Gunakan state yang baru
                onClose={() => {
                    setIsContactModalOpen(false); // <-- Gunakan state yang baru
                    setIsCopied(false);
                }}
            >
                <div className="modal-content-booking">
                    <h2 style={{ marginTop: 0 }}>Hubungi Pemilik</h2>
                    <p>Permintaan booking telah dikirim ke pemilik.</p>
                    <p>Silakan hubungi pemilik langsung di:</p>
                    <div className="contact-copy-wrapper">
                        <h3 className="contact-number-box">
                            {ownerPhone}
                        </h3>
                        <button
                            className="copy-button"
                            onClick={handleCopy}
                            disabled={isCopied}
                        >
                            {isCopied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ItemDetailPage;