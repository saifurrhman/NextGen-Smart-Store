import axios from 'axios';

// Backend API URL
const API_BASE_URL = 'http://localhost:8000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    // Content-Type is automatically set by axios for FormData
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor - Add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');

    // Skip adding token for public auth endpoints to avoid 401s on invalid/expired tokens
    const isPublicAuth = config.url?.includes('/auth/') && !config.url?.includes('/auth/logout');

    if (token && !isPublicAuth) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = error.config?.url?.includes('/auth/login') ||
      error.config?.url?.includes('/auth/register') ||
      error.config?.url?.includes('/auth/otp');

    if (error.response?.status === 401 && !isAuthRequest) {
      const role = localStorage.getItem('role')?.toUpperCase();

      // Clear all auth data
      localStorage.removeItem('authToken');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');

      // Role-based redirection
      if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
        window.location.href = '/admin/login';
      } else if (role === 'VENDOR') {
        window.location.href = '/vendor/login';
      } else if (role === 'DELIVERY') {
        window.location.href = '/delivery/login';
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Export API endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  logout: () => api.post('/auth/logout/'),
  refresh: (refresh) => api.post('/auth/refresh/', { refresh }),
  // OTP flow
  sendOTP: (data) => api.post('/auth/otp/send/', data),
  verifyOTP: (data) => api.post('/auth/otp/verify/', data),
  registerWithOTP: (data) => api.post('/auth/register-otp/', data),
  forgotPassword: (data) => api.post('/auth/otp/send/', { ...data, purpose: 'password_reset' }),
  resetPassword: (data) => api.post('/auth/password/reset/confirm/', data),
};

export const productsAPI = {
  getAll: (params) => api.get('/products/', { params }),
  getById: (id) => api.get(`/products/${id}/`),
  create: (data) => api.post('/products/', data),
  update: (id, data) => api.put(`/products/${id}/`, data),
  delete: (id) => api.delete(`/products/${id}/`),
  getMasterCatalog: (params) => api.get('/products/master-catalog/', { params }),
  // Product Requests
  getRequests: () => api.get('/products/requests/'),
  submitRequest: (data) => api.post('/products/requests/', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  approveRequest: (id, notes) => api.post(`/products/requests/${id}/approve/`, { notes }),
  rejectRequest: (id, notes) => api.post(`/products/requests/${id}/reject/`, { notes }),
};

export const cartAPI = {
  get: () => api.get('/cart/'),
  add: (data) => api.post('/cart/add/', data),
  remove: (id) => api.delete(`/cart/${id}/`),
  update: (id, data) => api.patch(`/cart/${id}/`, data),
};

export const ordersAPI = {
  getAll: () => api.get('/orders/'),
  getById: (id) => api.get(`/orders/${id}/`),
  create: (data) => api.post('/orders/', data),
};

export const bulkOrdersAPI = {
  getAll: () => api.get('/orders/bulk-orders/'),
  getById: (id) => api.get(`/orders/bulk-orders/${id}/`),
  create: (data) => api.post('/orders/bulk-orders/', data),
  approve: (id) => api.post(`/orders/bulk-orders/${id}/approve/`),
};

export const profileAPI = {
  getProfile: () => api.get('/users/profile/'),
  updateProfile: (data) => api.put('/users/profile/', data),
  changePassword: (data) => api.post('/users/change-password/', data),
};

export const invitationsAPI = {
  send: (data) => api.post('/users/invitations/send/', data),
  list: () => api.get('/users/invitations/'),
  accept: (token, data) => api.post(`/users/invitations/accept/${token}/`, data),
  verify: (token) => api.get(`/users/invitations/accept/${token}/`),
  remove: (id) => api.delete(`/users/invitations/${id}/`),
};
