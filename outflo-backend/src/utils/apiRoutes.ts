const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

export const API_ROUTES = {
  // Campaign routes
  CAMPAIGNS: {
    LIST: `${BASE_URL}/campaigns`,
    GET: (id: string) => `${BASE_URL}/campaigns/${id}`,
    CREATE: `${BASE_URL}/campaigns`,
    UPDATE: (id: string) => `${BASE_URL}/campaigns/${id}`,
    DELETE: (id: string) => `${BASE_URL}/campaigns/${id}`,
  },

  // Message routes
  MESSAGES: {
    GENERATE: `${BASE_URL}/messages/personalized-message`,
    GENERATE_FROM_URL: `${BASE_URL}/messages/personalized-message-url`,
  },
};

export default API_ROUTES;
