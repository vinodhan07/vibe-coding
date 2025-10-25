export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://192.168.1.8:5000";

export const API_ENDPOINTS = {
  health: `${API_BASE_URL}/api/v1/health`,
  check: `${API_BASE_URL}/api/v1/check`,
  subscribe: `${API_BASE_URL}/api/v1/subscribe`,
} as const;
