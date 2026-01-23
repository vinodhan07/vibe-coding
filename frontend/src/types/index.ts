/**
 * Shared TypeScript types for the Domain Suggester application.
 */

// Domain checking types
export interface DomainResult {
    domain: string;
    available: boolean;
}

export interface CheckResponse {
    input: string;
    is_domain: boolean;
    main_result?: DomainResult;
    suggestions?: DomainResult[];
    error?: string;
}

// Subscription types
export interface SubscribeRequest {
    email: string;
    domain: string;
}

export interface SubscribeResponse {
    message: string;
}

// Health check types
export interface HealthResponse {
    status: string;
    whois_configured: boolean;
    smtp_configured: boolean;
}
