/**
 * Subscription service.
 */
import { apiRequest, API_ENDPOINTS } from "./api";
import type { SubscribeResponse } from "@/types";

export const subscriptionService = {
    /**
     * Subscribe to notifications for a domain.
     */
    subscribe: async (email: string, domain: string): Promise<SubscribeResponse> => {
        return apiRequest<SubscribeResponse>(API_ENDPOINTS.subscribe, {
            method: "POST",
            body: JSON.stringify({ email, domain }),
        });
    },
};
