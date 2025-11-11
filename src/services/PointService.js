// src/services/pointService.js
import api from './api.js';

/**
 * GET /api/points/balance
 * Mengambil total poin user saat ini.
 */
export const getPointsBalance = () => {
    // API response diharapkan: { balance: 10 }
    return api.get('/points/balance');
};

/**
 * POST /api/points/buy
 * Membeli paket poin.
 */
export const buyPoints = (packageId) => {
    // packageId bisa "package_5000" or "package_10000"
    // API response diharapkan: { success: true, newBalance: 13 }
    return api.post('/points/buy', { packageId });
};