// src/pages/user/EditItemPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItemById, updateItem } from '../../services/itemService';
import Button from '../../components/common/Button';
import '../public/AuthPage.css'; // Pakai ulang layout
import '../../components/item/ItemForm.css'; // Pakai ulang style form

// Salin/paste daftar KATEGORI dari ItemForm.jsx kamu
const CATEGORIES = [
    { id: "11111111-1111-1111-1111-111111111111", name: "Electronics" },
    { id: "22222222-2222-2222-2222-222222222222", name: "Furniture" },
    { id: "33333333-3333-3333-3333-333333333333", name: "Books" },
    { id: "4f444444-4444-4444-4444-444444444444", name: "Clothing" },
    { id: "55555555-5555-5555-5555-555555555555", name: "Sports & Outdoors" },
    { id: "66666666-6666-6666-6666-666666666666", name: "Toys & Games" },
    { id: "77777777-7777-7777-7777-777777777777", name: "Home & Garden" },
    { id: "88888888-8888-8888-8888-888888888888", name: "Other" },
];

const EditItemPage = () => {
    const { id } = useParams(); // Ambil ID item dari URL
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        categoryId: CATEGORIES[0].id,
        request: '',
    });
    const [isLoading, setIsLoading] = useState(true); // Mulai loading untuk fetch data
    const [error, setError] = useState(null);

    // 1. Ambil data item yang ada saat halaman dimuat
    useEffect(() => {
        const fetchItemData = async () => {
            try {
                const response = await getItemById(id);
                const item = response.data;
                // Isi form dengan data yang ada
                setFormData({
                    name: item.name,
                    description: item.description,
                    categoryId: item.categoryId,
                    request: item.request, // Sesuai API, 'request' ada di body
                });
            } catch (err) {
                console.error("Gagal mengambil data item", err);
                setError("Gagal memuat data item.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchItemData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 2. Handle submit untuk UPDATE
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // Panggil fungsi updateItem baru
            await updateItem(id, formData);

            alert('Item berhasil di-update!');
            navigate(`/item/${id}`); // Arahkan kembali ke halaman detail

        } catch (err) {
            console.error('Gagal update item:', err);
            setError('Gagal update item. Coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !formData.name) { // Tampilkan loading saat fetch
        return <div className="loading-text">Loading item details...</div>;
    }

    return (
        <div className="auth-page-container">
            <div className="auth-card">
                <h2 className="auth-title">Update Barang Kamu</h2>
                <p className="auth-subtitle">Edit detail barang jualan kamu.</p>

                <form className="item-form" onSubmit={handleSubmit}>
                    {error && <p className="form-error">{error}</p>}

                    <div className="form-group">
                        <label htmlFor="name">Nama Item</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Deskripsi</label>
                        <textarea
                            id="description"
                            name="description"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="categoryId">Kategori</label>
                        <select
                            id="categoryId"
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            required
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="request">Pesan untuk Admin</label>
                        <textarea
                            id="request"
                            name="request"
                            rows="3"
                            value={formData.request}
                            onChange={handleChange}
                        />
                    </div>

                    {/* API PUT tidak menyertakan upload gambar, jadi kita hilangkan */}

                    <Button type="submit" variant="primary" className="submit-button" disabled={isLoading}>
                        {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default EditItemPage;