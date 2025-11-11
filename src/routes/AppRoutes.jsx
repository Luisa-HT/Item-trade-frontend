// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/public/HomePage'; // Import the page we just made
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from "../pages/public/RegisterPage.jsx";
import ItemDetailPage from "../pages/public/ItemDetailPage.jsx";
import UserRoute from './UserRoutes.jsx';
import UserDashboardPage from '../pages/user/UserDashboardPage.jsx';
import BookingDetailPage from "../pages/public/BookingDetailPage.jsx";
import PostItemPage from "../pages/user/PostItemPage.jsx";
import ProfilePage from "../pages/user/ProfilePage.jsx";
import SearchResultsPage from "../pages/public/SearchResultsPage.jsx";
import BuyPointsPage from "../pages/user/BuyPointsPage.jsx";

export const AppRoutes = () => {
    return (
        <Routes>
            {/* This is your main route */}
            <Route path="/" element={<HomePage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
            <Route path="/item/:id" element={<ItemDetailPage/>}/>
            <Route path="/search" element={<SearchResultsPage />} />
            {/* You will add all your other pages here later */}
            {/* <Route path="/login" element={<LoginPage />} /> */}
            {/* <Route path="/dashboard" element={<UserDashboardPage />} /> */}

            <Route path="/" element={<UserRoute/>}>
                <Route path="/dashboard" element={<UserDashboardPage/>}/>
                <Route path="/booking/:id" element={<BookingDetailPage/>}/>
                <Route path="/post-item" element={<PostItemPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/points" element={<BuyPointsPage />} />
                {/* <Route path="/post-item" element={<PostItemPage />} /> */}
                {/* <Route path="/profile" element={<ProfilePage />} /> */}
            </Route>

        </Routes>
    );
};