import api from "./api.js";

export const getBookingById = async (id) => {
    return api.get(`/Booking/${id}`);
}

export const getBookingByItemId = async (itemId) => {
    return api.get(`/Booking/item/${itemId}`);
}

export const getMyBookings = async () => {
    return api.get('/Booking/my-bookings');
}

export const createBooking = async (itemId, bookingData) => {
    return api.post(`/Booking/item/${itemId}`, bookingData);
}
export const cancelBooking = async (id) => {
    return api.put(`/Booking/${id}/cancel`);
}