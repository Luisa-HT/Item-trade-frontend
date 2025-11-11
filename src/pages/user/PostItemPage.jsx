// src/pages/user/PostItemPage.jsx
import React from 'react';
import Card from '../../components/common/Card';
import ItemForm from '../../components/item/ItemForm';
import '../public/AuthPage.css'; // Kita pakai ulang CSS layout ini

const PostItemPage = () => {
    return (
        <div className="auth-page-container">
            <Card className="auth-card">
                <h2 className="auth-title">Post Barang Baru</h2>
                <p className="auth-subtitle">Isi detail barang yang ingin kamu tukar.</p>

                <ItemForm />

            </Card>
        </div>
    );
};

export default PostItemPage;