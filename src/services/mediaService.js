import api from "./api.js";
    //
    // export const uploadMedia =async (id, file) => {
    //     return api.post(`/Media/upload/${id}`, file);
    // }
export const uploadMedia = async (id, file) => {
    const formData = new FormData();
    // Key 'file' harus cocok dengan apa yang diharapkan backend API
    formData.append('file', file);

    return api.post(`/Media/upload/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data', // Header ini WAJIB
        },
    });
}
export const deleteMedia = async (id) => {
    return api.delete(`/Media/${id}`);
}