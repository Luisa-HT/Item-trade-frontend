// src/pages/public/SearchResultsPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // 1. Kita butuh setSearchParams
import { searchItems } from '../../services/itemService';
import ItemList from '../../components/item/ItemList';
import CategorySidebar from '../../components/common/CategorySidebar'; // 2. IMPORT SIDEBAR
import './SearchResultsPage.css';

const SearchResultsPage = () => {
    // 3. Kita ambil 'setSearchParams' untuk mengubah URL
    const [searchParams, setSearchParams] = useSearchParams();
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // 4. Kita baca KEDUA parameter dari URL
    const query = searchParams.get('q');
    const selectedCategoryId = searchParams.get('category'); // 'null' jika tidak ada

    // 5. useEffect sekarang bergantung pada KEDUA filter
    useEffect(() => {
        if (query) {
            const fetchResults = async () => {
                try {
                    setIsLoading(true);
                    // 6. Teruskan KEDUA filter ke service
                    const response = await searchItems(query, selectedCategoryId);
                    setResults(response.data.data || []);
                } catch (error) {
                    console.error('Failed to fetch search results:', error);
                    setResults([]);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchResults();
        } else {
            setIsLoading(false);
            setResults([]);
        }
    }, [query, selectedCategoryId]); // 7. Dependency array diupdate

    // 8. Fungsi baru untuk mengubah URL saat filter diklik
    const handleCategorySelect = (categoryId) => {
        // Kita buat object params baru
        const newParams = { q: query };

        // Tambahkan 'category' HANYA jika ada (bukan null)
        if (categoryId) {
            newParams.category = categoryId;
        }

        // setCountSearchParams akan memperbarui URL tanpa reload halaman
        setSearchParams(newParams);
    };

    if (isLoading) {
        return <div className="loading-text">Searching for "{query}"...</div>;
    }

    return (
        // 9. GANTI JSX ke layout 2-kolom
        <div className="page-with-sidebar">

            {/* Kolom Kiri: Sidebar */}
            <CategorySidebar
                selectedCategoryId={selectedCategoryId}
                onCategorySelect={handleCategorySelect}
            />

            {/* Kolom Kanan: Konten Utama */}
            <div className="main-content-area">
                <h1 className="search-results-title">
                    Hasil Pencarian untuk: "{query}"
                </h1>

                {results.length > 0 ? (
                    <ItemList items={results} className="search-list" />
                ) : (
                    <p className="no-results-text">Tidak ada barang yang cocok.</p>
                )}
            </div>
        </div>
    );
};

export default SearchResultsPage;