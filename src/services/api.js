// src/services/api.js
import axios from 'axios';

// 1. Create the central Axios instance
const api = axios.create({
    // Set the base URL from your API documentation
    baseURL: 'https://server.welazure.dev/api',
});

// 2. Add an "interceptor" to automatically add the auth token
// This function runs BEFORE every single request is sent
api.interceptors.request.use(
    (config) => {
        // 3. Get the token from local storage
        const token = localStorage.getItem('authToken');

        // 4. If the token exists, add it to the 'Authorization' header
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        // 5. Return the modified config so the request can proceed
        return config;
    },
    (error) => {
        // Handle any errors during the request setup
        return Promise.reject(error);
    }
);

// 6. Export the configured instance to be used everywhere else
export default api;