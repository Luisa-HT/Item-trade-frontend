import api from './api';

export const getCategory = async () => {
    return api.get('/Category');
}
export const createCategory = async (categoryData) => {
    return api.post('/Category', categoryData);
}
export const getCategoryById = async (id) => {
    return api.get(`/Category/${id}`);
}
export const updateCategory = async (id,categoryData) => {
    return api.put(`/Category/${id}`, categoryData);
}
export const deleteCategory = async (id) => {
    return api.delete(`/Category/${id}`);
}