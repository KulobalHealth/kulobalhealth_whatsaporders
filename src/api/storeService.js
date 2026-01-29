import api from './apiService';
import { ENDPOINTS, STORE_USERNAME } from './config';

/**
 * Store Service - Fetch pharmacy/store data
 */

export const storeService = {
  /**
   * Get store information by username
   * @param {string} username - Store username (defaults to configured store)
   * @returns {Promise} - Store data
   */
  getStore: async (username = STORE_USERNAME) => {
    try {
      const data = await api.get(ENDPOINTS.GET_STORE(username));
      return data;
    } catch (error) {
      console.error('Error fetching store:', error);
      throw error;
    }
  },

  /**
   * Get inventory/products for a store
   * @param {string} username - Store username (defaults to configured store)
   * @param {string} search - Search query (optional)
   * @returns {Promise} - Inventory data
   */
  getInventory: async (username = STORE_USERNAME, search = '') => {
    try {
      const data = await api.get(ENDPOINTS.GET_INVENTORY(username, search));
      return data;
    } catch (error) {
      console.error('Error fetching inventory:', error);
      throw error;
    }
  },

  /**
   * Search inventory/products
   * @param {string} search - Search query
   * @param {string} username - Store username (defaults to configured store)
   * @returns {Promise} - Search results
   */
  searchInventory: async (search, username = STORE_USERNAME) => {
    try {
      const data = await api.get(ENDPOINTS.GET_INVENTORY(username, search));
      return data;
    } catch (error) {
      console.error('Error searching inventory:', error);
      throw error;
    }
  },

  /**
   * Submit order via WhatsApp
   * @param {Object} orderData - Order data including cart items and delivery info
   * @returns {Promise} - Order response
   */
  submitWhatsAppOrder: async (orderData) => {
    try {
      const data = await api.post(ENDPOINTS.WHATSAPP_ORDERS, orderData);
      return data;
    } catch (error) {
      console.error('Error submitting WhatsApp order:', error);
      throw error;
    }
  },
};

export default storeService;
