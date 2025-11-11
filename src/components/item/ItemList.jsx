// src/components/item/ItemList.jsx
import React from 'react';
import ItemCard from './ItemCard';
import './ItemList.css'; // We'll create this next

/**
 * Renders a list of items in a responsive grid.
 *
 * @param {Object} props
 * @param {Array} props.items - The array of item objects to render.
 */
const ItemList = ({ items, className = '' }) => {    return (
        <div className={`item-list ${className}`.trim()}>
            {items.length === 0 ? (
                <p className="no-items-text">No items found.</p>
            ) : (
                items.map(item => (
                    <ItemCard key={item.id} item={item} />
                ))
            )}
        </div>
    );
};

export default ItemList;