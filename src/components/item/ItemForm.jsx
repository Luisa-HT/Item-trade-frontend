// src/components/item/ItemForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createItem } from '../../services/itemService';
import {uploadMedia} from "../../services/mediaService.js";
import Button from '../common/Button';
import './ItemForm.css'; // Kita akan buat file ini

// Kategori yang kamu berikan
const CATEGORIES = [
    { id: "11111111-1111-1111-1111-111111111111", name: "Electronics" },
    { id: "22222222-2222-2222-2222-222222222222", name: "Furniture" },
    { id: "33333333-3333-3333-3333-333333333333", name: "Books" },
    { id: "44444444-4444-4444-4444-444444444444", name: "Clothing" },
    { id: "55555555-5555-5555-5555-555555555555", name: "Sports & Outdoors" },
    { id: "66666666-6666-6666-6666-666666666666", name: "Toys & Games" },
    { id: "77777777-7777-7777-7777-777777777777", name: "Home & Garden" },
    { id: "88888888-8888-8888-8888-888888888888", name: "Other" },
];

const ItemForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        categoryId: CATEGORIES[0].id, // Default ke kategori pertama
        request: '', // Ini untuk "request message"
    });
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setSelectedFiles(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!selectedFiles || selectedFiles.length === 0) {
            setError('Harap upload setidaknya satu gambar.');
            return;
        }

        setIsLoading(true);

        try {
            // Langkah 1: Buat item
            const itemResponse = await createItem(formData);
            const newItemId = itemResponse.data.id;

            // Langkah 2: Upload gambar (menggunakan fungsi baru)
            for (const file of selectedFiles) {
                // 👇 GUNAKAN FUNGSI BARU INI
                await uploadMedia(newItemId, file);
            }

            alert('Barang berhasil di-post! Menunggu persetujuan admin.');
            navigate('/dashboard');

        } catch (err) {
            console.error('Gagal memposting item:', err);
            setError('Gagal memposting item. Coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
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
                <label htmlFor="request">Pesan untuk Admin (Request Approval)</label>
                <textarea
                    id="request"
                    name="request"
                    rows="3"
                    placeholder="Contoh: Tolong approve, barang ini original."
                    value={formData.request}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label htmlFor="images">Gambar Item</label>
                <input
                    id="images"
                    name="images"
                    type="file"
                    multiple // Izinkan upload banyak file
                    accept="image/png, image/jpeg" // Hanya izinkan gambar
                    onChange={handleFileChange}
                    required
                />
            </div>

            <Button type="submit" variant="primary" className="submit-button" disabled={isLoading}>
                {isLoading ? 'Mengirim...' : 'Post Barang'}
            </Button>
        </form>
    );
};

export default ItemForm;