// src/components/common/CategorySidebar.jsx
import React from 'react';
import './CategorySidebar.css'; // Kita akan buat file ini

// Hardcode 8 kategori yang kamu berikan
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

/**
 * @param {Object} props
 * @param {string | null} props.selectedCategoryId - ID kategori yang sedang aktif.
 * @param {Function} props.onCategorySelect - Fungsi untuk dipanggil saat kategori diklik.
 */
const CategorySidebar = ({ selectedCategoryId, onCategorySelect }) => {
    return (
        <aside className="sidebar-container">
            <h4>Kategori</h4>
            <ul className="category-list">
                {/* Tombol untuk "Semua Kategori" */}
                <li
                    className={`category-item ${!selectedCategoryId ? 'active' : ''}`}
                    onClick={() => onCategorySelect(null)} // 'null' berarti tanpa filter
                >
                    Semua Kategori
                </li>

                {/* Render semua kategori dari list */}
                {CATEGORIES.map(category => (
                    <li
                        key={category.id}
                        className={`category-item ${selectedCategoryId === category.id ? 'active' : ''}`}
                        onClick={() => onCategorySelect(category.id)}
                    >
                        {category.name}
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default CategorySidebar;