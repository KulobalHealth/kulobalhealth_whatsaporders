// API Configuration
// Use environment variable if available, otherwise fall back to defaults
const isDevelopment = import.meta.env.DEV;

// In production, use environment variable or default production URL
// In development, use proxy for CORS handling
export const API_BASE_URL = isDevelopment 
  ? '/api/v1'  // Vite proxy will forward to the actual backend
  : (import.meta.env.VITE_API_URL || 'https://kulobalhealth-backend-1.onrender.com/api/v1');

// API Endpoints
export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  
  // Products/Medications
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id) => `/products/${id}`,
  SEARCH_PRODUCTS: '/products/search',
  
  // Orders
  ORDERS: '/orders',
  ORDER_BY_ID: (id) => `/orders/${id}`,
  
  // Cart
  CART: '/cart',
  ADD_TO_CART: '/cart/add',
  UPDATE_CART: '/cart/update',
  REMOVE_FROM_CART: (id) => `/cart/remove/${id}`,
  
  // User
  USER_PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
  
  // Pharmacist
  CHAT_WITH_PHARMACIST: '/pharmacist/chat',
  
  // Pharmacy/Store
  GET_STORE: (username) => `/pharmacy/checkout/get-store?username=${username}`,
  GET_INVENTORY: (username, search = '') => {
    let url = `/pharmacy/checkout/get-inventory?username=${username}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    return url;
  },
  WHATSAPP_ORDERS: '/pharmacy/checkout/whatsapp-orders',
  
  // Prescriptions
  UPLOAD_PRESCRIPTION: '/prescriptions/upload',
  PRESCRIPTIONS: '/prescriptions',
};

// Store Configuration
export const STORE_USERNAME = 'benny-pharmacy';

export default API_BASE_URL;
