import React, {useEffect, useState} from 'react';
import {getItems} from "../../services/itemService.js";
import './HomePage.css';
import ItemList from "../../components/item/ItemList.jsx";
import CategorySidebar from "../../components/common/CategorySidebar.jsx";
import Button from "../../components/common/Button.jsx";

function HomePage() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null); // 'null' = Semua
    const [currentPage, setCurrentPage] = useState(1); // Mulai dari halaman 1
    const [totalPages, setTotalPages] = useState(0); // Didapat dari API

    useEffect(() => {
        const fetchItems = async () => {
            try {
                setIsLoading(true);

                // Teruskan ID kategori DAN halaman saat ini
                const response = await getItems(selectedCategoryId, currentPage);

                // Asumsi API mengembalikan data seperti ini
                setItems(response.data.data || []);
                setTotalPages(response.data.totalPages || 0); // Simpan total halaman

            } catch (error) {
                console.error('Failed to fetch items:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchItems();
    }, [selectedCategoryId, currentPage]);// The empty [] means this runs only once

    const handleCategorySelect = (categoryId) => {
        setSelectedCategoryId(categoryId);
        setCurrentPage(1);
    };

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages)); // Tidak boleh lebih dari total
    };

    return (
        <div className="page-with-sidebar">

            {/* Kolom Kiri: Sidebar */}
            <CategorySidebar
                selectedCategoryId={selectedCategoryId}
                onCategorySelect={handleCategorySelect} // Kirim fungsi set state
            />

            <div className="main-content-area">

                {isLoading ? (
                    <div className="loading-text">Loading items...</div>
                ) : (
                    <>
                    <ItemList items={items} className="home-list" />
                {totalPages > 1 && (
                    <div className="pagination-footer">
                    <Button
                    onClick={handlePrevPage}
                disabled={currentPage === 1}
                variant="secondary"
            >
                &lt; Previous
            </Button>
            <span>
                  Page {currentPage} of {totalPages}
                </span>
            <Button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                variant="secondary"
            >
                Next &gt;
            </Button>
        </div>
    )}
</>
)}
</div>
</div>
);
}
export default HomePage;