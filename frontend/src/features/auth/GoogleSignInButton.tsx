import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/AuthContext";

// You need to get this from Google Cloud Console
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize: (config: {
                        client_id: string;
                        callback: (response: { credential: string }) => void;
                    }) => void;
                    renderButton: (
                        element: HTMLElement,
                        config: { theme: string; size: string; width: number }
                    ) => void;
                };
            };
        };
    }
}

interface GoogleSignInButtonProps {
    onSuccess?: () => void;
}

export const GoogleSignInButton = ({ onSuccess }: GoogleSignInButtonProps) => {
    const buttonRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { googleLogin } = useAuth();

    useEffect(() => {
        if (!GOOGLE_CLIENT_ID) {
            console.warn("Google Client ID not configured");
            return;
        }

        const initializeGoogle = () => {
            if (window.google && buttonRef.current) {
                window.google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: async (response) => {
                        try {
                            await googleLogin(response.credential);
                            toast.success("Signed in with Google!");
                            onSuccess?.();
                            navigate("/");
                        } catch (error) {
                            const message = error instanceof Error ? error.message : "Google sign-in failed";
                            toast.error(message);
                        }
                    },
                });

                window.google.accounts.id.renderButton(buttonRef.current, {
                    theme: "outline",
                    size: "large",
                    width: 300,
                });
            }
        };

        // Wait for Google script to load
        if (window.google) {
            initializeGoogle();
        } else {
            const interval = setInterval(() => {
                if (window.google) {
                    initializeGoogle();
                    clearInterval(interval);
                }
            }, 100);

            return () => clearInterval(interval);
        }
    }, [googleLogin, navigate, onSuccess]);

    if (!GOOGLE_CLIENT_ID) {
        return null;
    }

    return (
        <div className="flex justify-center">
            <div ref={buttonRef} />
        </div>
    );
};
