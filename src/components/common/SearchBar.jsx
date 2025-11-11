// src/components/common/SearchBar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css'; // Import the new CSS

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault(); // Prevent the form from reloading the page
        if (query.trim()) {
            navigate(`/search?q=${query}`);
            console.log('Searching for:', query);
            // Example: navigate(`/search?q=${query}`);
        }
    };

    return (
        <form className="search-form" onSubmit={handleSearch}>
            <input
                type="text"
                className="search-input"
                placeholder="Cari barang..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="search-button">
                Search
            </button>

        </form>
    );
};

export default SearchBar;