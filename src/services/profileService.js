import api from "./api.js";

export const getMyProfile = async () => {
    return api.get('/Profile/me');
}
export const updateProfile = async () => {
    return api.put(`/Profile/me`)
}