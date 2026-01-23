/**
 * Domain checking service.
 */
import { apiRequest, API_ENDPOINTS } from "./api";
import type { CheckResponse } from "@/types";

export const domainService = {
    /**
     * Check if a domain is available or get suggestions.
     */
    checkAvailability: async (query: string): Promise<CheckResponse> => {
        return apiRequest<CheckResponse>(API_ENDPOINTS.check, {
            method: "POST",
            body: JSON.stringify({ input: query }),
        });
    },
};
