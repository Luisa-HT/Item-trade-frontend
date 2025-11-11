import React, {useEffect, useState} from 'react';
import {getItems} from "../../services/itemService.js";
import './HomePage.css';
import ItemList from "../../components/item/ItemList.jsx";
import CategorySidebar from "../../components/common/CategorySidebar.jsx";

function HomePage() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null); // 'null' = Semua

    useEffect(() => {
        const fetchItems = async () => {
            try {
                setIsLoading(true); // Set loading setiap kali filter berubah

                // Teruskan ID kategori ke service
                const response = await getItems(selectedCategoryId);

                setItems(response.data.data || []);
            } catch (error) {
                console.error('Failed to fetch items:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchItems();
    }, [selectedCategoryId]);// The empty [] means this runs only once

    return (
        <div className="page-with-sidebar">

            {/* Kolom Kiri: Sidebar */}
            <CategorySidebar
                selectedCategoryId={selectedCategoryId}
                onCategorySelect={setSelectedCategoryId} // Kirim fungsi set state
            />

            {/* Kolom Kanan: Konten Utama */}
            <div className="main-content-area">
                {/*<h1 className="homepage-title">Welcome to Tuker.in</h1>*/}
                {/*<p className="homepage-subtitle">Browse and trade items with other users</p>*/}

                {isLoading ? (
                    <div className="loading-text">Loading items...</div>
                ) : (
                    <ItemList items={items} className="home-list" />
                )}
            </div>
        </div>
    );
}

export default HomePage;