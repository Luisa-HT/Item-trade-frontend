import api from "./api.js";

export const login = async (credentials) => {
    return api.post('/Auth/login', credentials);
}

export const register = async (userData) => {
    return api.post('/Auth/register', userData);
}