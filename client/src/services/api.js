import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests automatically
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// API methods
export const authAPI = {
    register: (username, password, role) =>
        api.post('/auth/register', { username, password, role }),

    login: (username, password) =>
        api.post('/auth/login', { username, password }),
};

export const roleAPI = {
    getAll: () => api.get('/roles'),

    getById: (id) => api.get(`/roles/${id}`),

    create: (name, permissions, description) =>
        api.post('/roles', { name, permissions, description }),

    update: (id, data) => api.put(`/roles/${id}`, data),

    delete: (id) => api.delete(`/roles/${id}`),
};

export const dashboardAPI = {
    getAdminDashboard: () => api.get('/dashboard/admin'),

    getUserDashboard: () => api.get('/dashboard/user'),

    getStats: () => api.get('/dashboard/stats'),
};

export default api;
