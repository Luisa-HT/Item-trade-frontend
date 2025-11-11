// src/components/common/PaymentModal.jsx
import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import './PaymentModal.css'; // Kita akan buat file ini

const PaymentModal = ({ isOpen, onClose, packageInfo, onConfirm, isLoading }) => {
    const [isPaying, setIsPaying] = useState(false);

    const handlePay = () => {
        setIsPaying(true);
        // Simulasi proses "pembayaran"
        setTimeout(() => {
            // Setelah 2 detik, panggil fungsi onConfirm (yang memanggil API)
            onConfirm();
            // isLoading akan menangani sisanya
        }, 2000);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="payment-modal-content">
                <h2 style={{ marginTop: 0 }}>Konfirmasi Pembayaran</h2>

                <p className="payment-summary">
                    Kamu akan membeli <strong>{packageInfo.name}</strong> seharga <strong>{packageInfo.price}</strong>.
                </p>

                <div className="dummy-payment-info">
                    <p>Ini adalah simulasi pembayaran.</p>
                    <p>Klik "Bayar Sekarang" untuk menyelesaikan transaksi (tidak ada tagihan nyata).</p>
                </div>

                <div className="payment-modal-actions">
                    <Button variant="secondary" onClick={onClose} disabled={isPaying || isLoading}>
                        Batal
                    </Button>
                    <Button variant="primary" onClick={handlePay} disabled={isPaying || isLoading}>
                        {isLoading ? 'Memproses...' : (isPaying ? 'Membayar...' : 'Bayar Sekarang')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default PaymentModal;