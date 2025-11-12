// src/services/adminService.js
import api from './api.js';

/**
 * GET /api/item/pending
 * Mengambil semua item yang menunggu persetujuan.
 */
export const getPendingItems = () => {
    return api.get('/item/pending');
};

/**
 * POST /api/item/{id}/approve
 * Menyetujui (approve) sebuah item.
 */
export const approveItem = (id) => {
    return api.post(`/item/${id}/approve`);
};

/**
 * DELETE /api/item/{id}
 * Menolak (reject) sebuah item.
 */
export const rejectItem = (id) => {
    return api.delete(`/item/${id}`);
};