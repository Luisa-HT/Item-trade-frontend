// src/pages/user/BuyPointsPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { buyPoints } from '../../services/pointService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import PaymentModal from '../../components/common/PaymentModal'; // Kita akan buat ini
import './BuyPointsPage.css';

// Info paket (sesuai request kamu)
const PACKAGES = [
    { id: 'package_5000', name: '3 Points', price: 'Rp 5.000' },
    { id: 'package_10000', name: '8 Points', price: 'Rp 10.000' },
];

const BuyPointsPage = () => {
    const { points, setPoints } = useAuth();
    const [selectedPackage, setSelectedPackage] = useState(null); // (null = modal tertutup)
    const [isLoading, setIsLoading] = useState(false);

    const handleBuyClick = (pkg) => {
        setSelectedPackage(pkg);
    };

    const handleConfirmPayment = async () => {
        setIsLoading(true);
        try {
            const response = await buyPoints(selectedPackage.id);

            setPoints(response.data.newBalance);
        } catch (err) {
            console.error('Pembelian gagal:', err);
            alert('Pembelian gagal. Coba lagi.');
        } finally {
            setIsLoading(false);
            setSelectedPackage(null); // Tutup modal
        }
    };

    return (
        <div className="buy-points-container">
            <h1>Beli Poin</h1>

            <div className="current-balance-card">
                <span className="balance-label">Poin Kamu Saat Ini:</span>
                <span className="balance-amount">{points} Pts</span>
            </div>

            <p className="buy-points-info">
                Postingan 2 barang pertama gratis. Untuk postingan selanjutnya,
                kamu butuh 1 Poin per postingan.
            </p>

            <div className="package-list">
                {PACKAGES.map(pkg => (
                    <div key={pkg.id} className="package-card">
                        <h2>{pkg.name}</h2>
                        <div className="package-price">{pkg.price}</div>
                        <Button variant="primary" onClick={() => handleBuyClick(pkg)}>
                            Beli Paket Ini
                        </Button>
                    </div>
                ))}
            </div>

            {/* Render Modal (hanya jika ada paket dipilih) */}
            {selectedPackage && (
                <PaymentModal
                    isOpen={!!selectedPackage}
                    onClose={() => setSelectedPackage(null)}
                    packageInfo={selectedPackage}
                    onConfirm={handleConfirmPayment}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
};

export default BuyPointsPage;