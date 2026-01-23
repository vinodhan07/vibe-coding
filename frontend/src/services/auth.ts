/**
 * Authentication service for API calls.
 */
import { apiRequest, API_BASE_URL } from "./api";

export interface User {
    email: string;
    name: string;
}

export interface AuthResponse {
    message: string;
    user: User;
    token: string;
}

const AUTH_ENDPOINTS = {
    register: `${API_BASE_URL}/api/v1/auth/register`,
    login: `${API_BASE_URL}/api/v1/auth/login`,
    logout: `${API_BASE_URL}/api/v1/auth/logout`,
    me: `${API_BASE_URL}/api/v1/auth/me`,
};

export const authService = {
    /**
     * Register a new user.
     */
    register: async (email: string, password: string, name: string): Promise<AuthResponse> => {
        return apiRequest<AuthResponse>(AUTH_ENDPOINTS.register, {
            method: "POST",
            body: JSON.stringify({ email, password, name }),
        });
    },

    /**
     * Login with email and password.
     */
    login: async (email: string, password: string): Promise<AuthResponse> => {
        return apiRequest<AuthResponse>(AUTH_ENDPOINTS.login, {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });
    },

    /**
     * Logout the current user.
     */
    logout: async (token: string): Promise<void> => {
        await apiRequest(AUTH_ENDPOINTS.logout, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
        });
    },

    /**
     * Get current user info.
     */
    getCurrentUser: async (token: string): Promise<{ user: User }> => {
        return apiRequest<{ user: User }>(AUTH_ENDPOINTS.me, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
    },

    /**
     * Login with Google OAuth credential.
     */
    googleLogin: async (credential: string): Promise<AuthResponse> => {
        return apiRequest<AuthResponse>(`${API_BASE_URL}/api/v1/auth/google`, {
            method: "POST",
            body: JSON.stringify({ credential }),
        });
    },
};
