import api from "./api.js";
//
// export const getItems = async () => {
//     return api.get('/Item');
// }
export const createItem = async (item) => {
    return api.post(`/Item`, item);
}
export const getItemById = async (id) => {
    return api.get(`/Item/${id}`);
}
export const deleteItem = async (id) => {
    return api.delete(`/Item/${id}`);
}
export const getMyItems = async () => {
    return api.get('/Item/my-items');
}
export const getPendingItems = async () => {
    return api.get('/Item/pending');
}
export const approveItem = async (id, approval) => {
    return api.post(`/Item/${id}/approve`, approval);
}
export const getItemCategories = async () => {
    return api.get('/Item/categories');
}
// export const searchItems = (query) => {
//     // We are assuming your API uses a 'search' query parameter
//     return api.get(`/item?searchTerm=${query}`);
// }

/**
 * GET /api/item
 * Mengambil item, BISA difilter berdasarkan categoryId.
 */
export const getItems = (categoryId, page) => {
    const params = {
        page: page || 1, // Default ke halaman 1 jika tidak disediakan
        pageSize: 9,
    };
    if (categoryId) {
        params.categoryId = categoryId; // Tambahkan ke params HANYA jika ada
    }
    // axios akan otomatis membuat URL: /item?categoryId=...
    return api.get('/item', { params });
};

/**
 * GET /api/item?searchTerm={query}&categoryId={id}
 * Mencari item, BISA difilter berdasarkan categoryId.
 */
export const searchItems = (query, categoryId, page) => {
    const params = {
        searchTerm: query,
        page: page || 1,
        pageSize: 9,
    };
    if (categoryId) {
        params.categoryId = categoryId;
    }
    // axios akan membuat URL: /item?searchTerm=...&categoryId=...
    return api.get('/item', { params });
};

export const updateItem = async (id, itemData) => {
    return api.put(`/Item/${id}`, itemData);
}