// src/lib/api.js
const API_BASE = import.meta.env.VITE_API_URL || 'https://chatbot-backend-r766.onrender.com';

const api = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem("token");   // or "access_token" if you use that

    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const config = {
      ...options,
      headers,
    };

    const response = await fetch(`${API_BASE}${endpoint}`, config);

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.detail || data.message || "Something went wrong");
    }

    return data;
  },

  // Helper methods
  get(endpoint) {
    return this.request(endpoint);
  },

  post(endpoint, body) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  put(endpoint, body) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  delete(endpoint) {
    return this.request(endpoint, {
      method: "DELETE",
    });
  },
};

export { api };