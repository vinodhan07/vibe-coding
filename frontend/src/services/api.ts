/**
 * Base API configuration and helper functions.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const API_ENDPOINTS = {
    health: `${API_BASE_URL}/api/v1/health`,
    check: `${API_BASE_URL}/api/v1/check`,
    subscribe: `${API_BASE_URL}/api/v1/subscribe`,
} as const;

/**
 * Generic API error class
 */
export class ApiError extends Error {
    constructor(public message: string, public status?: number) {
        super(message);
        this.name = "ApiError";
    }
}

/**
 * Wrapper for fetch with basic error handling
 */
export async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    try {
        const response = await fetch(endpoint, {
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
            ...options,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new ApiError(data.error || "API request failed", response.status);
        }

        return data as T;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(error instanceof Error ? error.message : "Likely a network error");
    }
}
