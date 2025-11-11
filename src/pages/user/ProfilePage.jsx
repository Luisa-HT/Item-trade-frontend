// src/pages/user/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../services/profileService';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import PlaceholderImage from '../../assets/placeholder.jpg';
import './ProfilePage.css'; // CSS untuk Tampilan
import '../../components/auth/AuthForm.css'; // Kita pakai ulang CSS form untuk modal

// Komponen helper untuk satu baris info
const InfoRow = ({ label, value, onEditClick, hideEdit = false }) => (
    <div className="profile-row">
        <span className="profile-label">{label}</span>
        <span className="profile-value">{value || '-'}</span>
        {!hideEdit && (
            <button className="edit-button" onClick={onEditClick}>
                ✎
            </button>
        )}
    </div>
);

const ProfilePage = () => {
    // Kita ambil 'user' dari context, tapi kita simpan di state LOKAL
    // agar kita bisa update tampilannya secara instan setelah edit
    const { user: authUser } = useAuth();
    const [user, setUser] = useState(authUser);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    // State untuk field yang sedang diedit di modal
    const [editField, setEditField] = useState(null); // (e.g., { name: 'name', label: 'Name' })
    const [editValue, setEditValue] = useState('');

    // Sinkronkan state lokal jika user dari context berubah
    useEffect(() => {
        setUser(authUser);
    }, [authUser]);

    // Fungsi untuk MEMBUKA modal
    const openEditModal = (fieldName, fieldLabel, currentValue) => {
        setEditField({ name: fieldName, label: fieldLabel });
        setEditValue(currentValue || '');
        setError(null); // Bersihkan error lama
        setMessage(null); // Bersihkan pesan sukses lama
        setIsModalOpen(true);
    };

    // Fungsi untuk MENYIMPAN dari modal
    const handleModalSave = async () => {
        setIsLoading(true);
        setError(null);
        setMessage(null);

        const dataToUpdate = { [editField.name]: editValue };

        try {
            // 1. Kirim update ke backend
            await updateProfile(dataToUpdate);

            // 2. Update state lokal secara instan
            setUser(prevUser => ({ ...prevUser, ...dataToUpdate }));

            setMessage('Update berhasil!');
            setIsModalOpen(false); // Tutup modal

        } catch (err) {
            console.error('Gagal update:', err);
            setError('Gagal menyimpan. Coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="profile-page-container">
            {/* --- Bagian Personal Info --- */}
            <Card className="profile-card-section">
                <h2>Personal Info</h2>

                {/* Profile Picture Row (Contoh, belum fungsional) */}
            {/*    <div className="profile-row picture-row">*/}
            {/*        <span className="profile-label">Profile Picture</span>*/}
            {/*        <div className="profile-value-picture">*/}
            {/*<span className="picture-note">*/}
            {/*  A profile picture helps personalize your account*/}
            {/*</span>*/}
            {/*            <img*/}
            {/*                src={user?.profileImageUrl || PlaceholderImage}*/}
            {/*                alt="Profile"*/}
            {/*                className="profile-avatar"*/}
            {/*            />*/}
            {/*        </div>*/}
            {/*        <button className="edit-button" onClick={() => alert('Fitur upload foto belum dibuat')}>*/}
            {/*            ✎*/}
            {/*        </button>*/}
            {/*    </div>*/}

                {/* Username (Tidak bisa diedit) */}
                <InfoRow
                    label="Username"
                    value={user?.username}
                    hideEdit={true}
                />

                {/* Name (Bisa diedit) */}
                <InfoRow
                    label="Name"
                    value={user?.name}
                    onEditClick={() => openEditModal('name', 'Name', user?.name)}
                />
            </Card>

            {/* --- Bagian Contact Info --- */}
            <Card className="profile-card-section">
                <h2>Contact Info</h2>

                <InfoRow
                    label="Email"
                    value={user?.email}
                    onEditClick={() => openEditModal('email', 'Email', user?.email)}
                />
                <InfoRow
                    label="Phone"
                    value={user?.phoneNumber}
                    onEditClick={() => openEditModal('phoneNumber', 'Phone Number', user?.phoneNumber)}
                />
                <InfoRow
                    label="Address"
                    value={user?.address}
                    onEditClick={() => openEditModal('address', 'Address', user?.address)}
                />
            </Card>

            {/* --- Modal yang bisa dipakai ulang --- */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {editField && (
                    <div className="edit-modal-content">
                        <h2 style={{ marginTop: 0 }}>Edit {editField.label}</h2>

                        {error && <p className="form-error">{error}</p>}

                        {/* Kita pakai style .form-group dari AuthForm.css */}
                        <div className="form-group">
                            <label htmlFor="editValue">{editField.label}</label>
                            <input
                                id="editValue"
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                            />
                        </div>

                        <div className="edit-modal-actions">
                            <Button
                                variant="secondary"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleModalSave}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Tampilkan pesan sukses di luar modal jika perlu */}
            {message && <p className="form-success-toast">{message}</p>}
        </div>
    );
};

export default ProfilePage;