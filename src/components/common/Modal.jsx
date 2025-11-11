// src/components/common/Modal.jsx
import React from 'react';
import './Modal.css'; // Kita akan buat file ini

/**
 * Komponen Modal Pop-up yang reusable.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Tampilkan modal jika true.
 * @param {Function} props.onClose - Fungsi untuk menutup modal.
 * @param {React.ReactNode} props.children - Konten yang akan ditampilkan di dalam modal.
 */
const Modal = ({ isOpen, onClose, children }) => {
    // Jangan render apa-apa jika isOpen false
    if (!isOpen) return null;

    return (
        // 1. Overlay (latar belakang gelap)
        <div className="modal-overlay" onClick={onClose}>

            {/* 2. Konten Modal (box putih) */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                {/* 3. Tombol Close (X) */}
                <button className="modal-close-button" onClick={onClose}>
                    &times;
                </button>

                {/* 4. Konten kamu (info kontak) */}
                {children}
            </div>
        </div>
    );
};

export default Modal;