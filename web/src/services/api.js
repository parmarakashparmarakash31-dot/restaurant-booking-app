import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ============= RESTAURANT APIs =============
export const getAllRestaurants = () => api.get('/restaurants');
export const getRestaurantById = (id) => api.get(`/restaurants/${id}`);
export const registerRestaurant = (data) => api.post('/restaurants/register', data);
export const updateRestaurant = (id, data) => api.put(`/restaurants/${id}`, data);
export const deleteRestaurant = (id) => api.delete(`/restaurants/${id}`);

// ============= BOOKING APIs =============
export const createBooking = (data) => api.post('/bookings', data);
export const getCustomerBookings = (customerId) => api.get(`/bookings/customer/${customerId}`);
export const getRestaurantBookings = (restaurantId) => api.get(`/bookings/restaurant/${restaurantId}`);
export const updateBooking = (id, data) => api.put(`/bookings/${id}`, data);
export const cancelBooking = (id) => api.delete(`/bookings/${id}`);

// ============= SEAT APIs =============
export const getSeats = (restaurantId) => api.get(`/seats/${restaurantId}`);
export const getAvailableSeats = (restaurantId) => api.get(`/seats/${restaurantId}/available`);
export const createSeats = (restaurantId, data) => api.post(`/seats/${restaurantId}/create`, data);
export const updateSeat = (seatId, data) => api.put(`/seats/${seatId}`, data);

export default api;
