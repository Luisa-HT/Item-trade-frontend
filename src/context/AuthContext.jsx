// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { login as loginService, register as registerService } from '../services/authService';
import { getMyProfile } from '../services/profileService';
import { getPointsBalance } from '../services/pointService'; // <-- 1. IMPORT

// 1. Create the Context
const AuthContext = createContext();

// 2. Create the Provider (the component that will wrap your app)
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Will store user data { id, username, role, ... }
    const [points, setPoints] = useState(0); // <-- 2. TAMBAHKAN STATE POINTS
    const [isLoading, setIsLoading] = useState(true); // Used to show a spinner while checking token
    const fetchAndUpdatePoints = useCallback(async () => {
        try {
            const response = await getPointsBalance();
            setPoints(response.data.points || 0); // Asumsi API mengembalikan { balance: 5 }
        } catch (err) {
            console.error("Failed to fetch points", err);
        }
    }, []);
    // 3. Check for existing token on app load (useEffect with empty array)
    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setIsLoading(false);
                return; // No token, no user, stop loading
            }

            try {
                // We have a token. Let's see if it's valid by fetching the profile.
                // The 'api.js' interceptor will automatically add the token to this request.
                // const response = await getMyProfile();
                // setUser(response.data); // Token is valid, set user
                await getMyProfile().then(res => setUser(res.data));
                await fetchAndUpdatePoints();
            } catch (error) {
                // Token is invalid or expired
                console.error('Token validation failed:', error);
                localStorage.removeItem('authToken'); // Clear the bad token
            } finally {
                setIsLoading(false); // Done loading
            }
        };

        validateToken();
    }, [fetchAndUpdatePoints]); // Empty dependency array means this runs ONCE when the component mounts

    // 4. Login Function
    const login = useCallback(async (credentials) => {
        try {
            const response = await loginService(credentials);
            const token = response.data.token;

            if (!token) {
                throw new Error('No token provided by server');
            }

            // 1. Save token to local storage (so api.js interceptor can use it)
            localStorage.setItem('authToken', token);

            // 2. Fetch the user's profile to store in our state
            const profileResponse = await getMyProfile();
            setUser(profileResponse.data);
            await fetchAndUpdatePoints();
            return profileResponse.data; // Return user data to the component
        } catch (error) {
            // On failed login, make sure everything is cleared
            localStorage.removeItem('authToken');
            setUser(null);
            throw error; // Re-throw the error so the login form can display it
        }
    }, []);

    // 5. Register Function
    const register = useCallback(async (userData) => {
        try {
            // Assuming your register endpoint also returns a token
            const response = await registerService(userData);
            const token = response.data.token;

            if (!token) {
                throw new Error('No token provided by server after registration');
            }

            // 1. Save token
            localStorage.setItem('authToken', token);

            // 2. Fetch user profile
            const profileResponse = await getMyProfile();
            setUser(profileResponse.data);

            return profileResponse.data;
        } catch (error) {
            localStorage.removeItem('authToken');
            setUser(null);
            throw error;
        }
    }, []);

    // 6. Logout Function
    const logout = useCallback(() => {
        setUser(null);
        setPoints(0);
        localStorage.removeItem('authToken');

        // The interceptor in api.js will now stop sending the token
    }, []);

    // 7. Value to be provided to all children
    const value = {
        user,
        points, // <-- 7. EXPOSE POINTS
        setPoints,
        fetchAndUpdatePoints, // <-- 7. EXPOSE FUNGSI REFRESH
        isLoading,
        login,
        logout,
        register,
        isAuthenticated: !!user, // A handy boolean: true if user is not null
    };

    return (
        <AuthContext.Provider value={value}>
            {/* Don't render the app until we've finished checking the token */}
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

// 8. Custom Hook (a shortcut for components to use the context)
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};