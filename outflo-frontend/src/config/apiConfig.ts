/**
 * API configuration for the application
 */

// Base URL for API requests
console.log("API Base URL:", import.meta.env.VITE_API_URL);
export const API_BASE_URL = import.meta.env.VITE_API_URL;

// API endpoints organized by resource
export const API_ROUTES = {
  campaigns: {
    getAll: "/api/campaigns",

    getById: (id: string) => `/api/campaigns/${id}`,
    create: "/api/campaigns",
    update: (id: string) => `/api/campaigns/${id}`,
    delete: (id: string) => `/api/campaigns/${id}`,
    updateStatus: (id: string) => `/api/campaigns/${id}/status`,
  },
  messages: {
    generateFromProfile: "/api/messages/personalized-message",
    generateFromUrl: "/api/messages/personalized-message-url",
  },
};
