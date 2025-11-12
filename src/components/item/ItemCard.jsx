// src/components/item/ItemCard.jsx
import React from "react";
import {Link} from "react-router-dom";
import PlaceHolderImage from "../../assets/placeholder.jpg";
import './ItemCard.css';

// Fungsi helper untuk status
const getStatus = (isApproved) => {
    if (isApproved === true) {
        return { text: 'Approved', class: 'status-approved' };
    }
    // 'false', 'null', dan 'undefined' semuanya adalah Pending
    return { text: 'Pending', class: 'status-pending' };
}

const ItemCard = ({item, showStatus = false}) => {
    const id = item?.id;
    const name = item?.name || 'Nama Tidak Tersedia';
    const description = item?.description || 'Deskripsi tidak tersedia.';

    // Logika URL Gambar yang sudah diperbaiki
    const images = item?.media || [];
    const BACKEND_URL = 'https://server.welazure.dev';
    const primaryImage = images.find(img => img.isPrimary) || images[0];
    const imagePath = primaryImage?.filePath;
    const imageUrl = imagePath ? (BACKEND_URL + imagePath) : PlaceHolderImage;

    // Logika Status yang sudah diperbaiki (aman ESLint)
    const hasStatus = 'isApproved' in item;
    const status = hasStatus ? getStatus(item.isApproved) : null;

    if (!id) {
        return null; // Jangan render apa-apa jika tidak ada ID
    }

    return (
        <div className="item-card">
            {/* Tampilkan badge HANYA jika showStatus true */}
            {showStatus && status && (
                <div className={`card-status-badge ${status.class}`}>
                    {status.text}
                </div>
            )}

            <Link to={`/item/${item.id}`} className="card-link">
                <div className="card-image-container">
                    <img src={imageUrl} alt={name} className="card-image"/>
                </div>
                <div className="card-content">
                    <h3 className="card-title">{name}</h3>
                    <p className="card-description">
                        {description.length > 100
                            ? `${description.substring(0, 100)}...`
                            : description}
                    </p>
                    <span className="card-view-details">View Details</span>
                </div>
            </Link>
        </div>
    );
};

export default ItemCard;