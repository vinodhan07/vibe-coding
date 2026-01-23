/**
 * Authentication context for managing user state across the app.
 */
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authService, User } from "@/services/auth";

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    googleLogin: (credential: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = "domain-suggester-auth-token";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        if (storedToken) {
            authService
                .getCurrentUser(storedToken)
                .then((data) => {
                    setUser(data.user);
                    setToken(storedToken);
                })
                .catch(() => {
                    localStorage.removeItem(TOKEN_KEY);
                })
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (email: string, password: string) => {
        const response = await authService.login(email, password);
        setUser(response.user);
        setToken(response.token);
        localStorage.setItem(TOKEN_KEY, response.token);
    };

    const register = async (email: string, password: string, name: string) => {
        const response = await authService.register(email, password, name);
        setUser(response.user);
        setToken(response.token);
        localStorage.setItem(TOKEN_KEY, response.token);
    };

    const googleLogin = async (credential: string) => {
        const response = await authService.googleLogin(credential);
        setUser(response.user);
        setToken(response.token);
        localStorage.setItem(TOKEN_KEY, response.token);
    };

    const logout = () => {
        if (token) {
            authService.logout(token).catch(() => { });
        }
        setUser(null);
        setToken(null);
        localStorage.removeItem(TOKEN_KEY);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                googleLogin,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
