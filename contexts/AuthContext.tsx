import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import * as SecureStore from "expo-secure-store";

interface AuthProps {
    authState?: {
        userId: string | null;
        accessToken: string | null;
        refreshToken: string | null;
        authenticated: boolean | null;
    };
    onRegister?: (
        email: string,
        firstName: string,
        lastName: string,
        password: string,
        confirmPassword: string
    ) => Promise<any>;
    onLogin?: (email: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
    onDelete?: () => Promise<any>;
}

const USER_ID_KEY = "user-id";
const ACCESS_TOKEN_KEY = "access-jwt";
const REFRESH_TOKEN_KEY = "refresh-jwt";
export const API_URL = process.env.EXPO_PUBLIC_API_URL;
const AuthContext = createContext<AuthProps>({});

export const AuthProvider = ({ children }: any) => {
    const [authState, setAuthState] = useState<{
        userId: string | null;
        accessToken: string | null;
        refreshToken: string | null;
        authenticated: boolean | null;
    }>({
        userId: null,
        accessToken: null,
        refreshToken: null,
        authenticated: null,
    });

    // Validate token
    const validateToken = (token: string): boolean => {
        try {
            const decoded: any = jwtDecode(token);
            const currentTime = Date.now() / 1000; // Convert to seconds
            return decoded.exp > currentTime;
        } catch (error) {
            return false;
        }
    };

    // Refresh the token
    const getNewToken = async (refreshToken: string) => {
        try {
            const response = await axios.post(`${API_URL}/api/token/refresh/`, {
                refresh: refreshToken,
            });

            const newAccessToken = response.data.access;
            await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, newAccessToken);
            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${newAccessToken}`;

            setAuthState((prevState) => ({
                ...prevState,
                accessToken: newAccessToken,
                authenticated: true,
            }));

            return true;
        } catch (error) {
            console.error("Failed to refresh token", error);
            await logout();
            return false;
        }
    };

    useEffect(() => {
        const loadTokens = async () => {
            const accessToken = await SecureStore.getItemAsync(
                ACCESS_TOKEN_KEY
            );
            const refreshToken = await SecureStore.getItemAsync(
                REFRESH_TOKEN_KEY
            );
            const userId = await SecureStore.getItemAsync(USER_ID_KEY);
            if (accessToken && refreshToken) {
                const isTokenValid = validateToken(accessToken);
                if (isTokenValid) {
                    setAuthState({
                        userId,
                        accessToken,
                        refreshToken,
                        authenticated: true,
                    });
                    axios.defaults.headers.common[
                        "Authorization"
                    ] = `Bearer ${accessToken}`;
                } else {
                    // Try to refresh the token if access token is expired
                    await getNewToken(refreshToken);
                }
            }
        };
        loadTokens();
    }, []);

    const register = async (
        email: string,
        firstName: string,
        lastName: string,
        password: string,
        confirmPassword: string
    ) => {
        try {
            const result = await axios.post(`${API_URL}/api/users/register/`, {
                // Change casing for consistency with api
                email,
                first_name: firstName,
                last_name: lastName,
                password,
                confirm_password: confirmPassword,
            });
            return {
                status: result.status,
            };
        } catch (e) {
            if (axios.isAxiosError(e) && e.response) {
                return {
                    error: true,
                    status: e.response.status,
                    data: e.response.data || "An error occurred.",
                };
            } else {
                return {
                    error: true,
                    status: null,
                    data: "An unexpected error occurred.",
                };
            }
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const result = await axios.post(`${API_URL}/api/token/`, {
                email,
                password,
            });
            await SecureStore.setItemAsync(
                ACCESS_TOKEN_KEY,
                result.data.access
            );
            await SecureStore.setItemAsync(
                REFRESH_TOKEN_KEY,
                result.data.refresh
            );
            await SecureStore.setItemAsync(
                USER_ID_KEY,
                result.data.id.toString()
            );
            setAuthState({
                userId: result.data.id.toString(),
                accessToken: result.data.access,
                refreshToken: result.data.refresh,
                authenticated: true,
            });
            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${result.data.access}`;
            return {
                status: result.status,
            };
        } catch (e) {
            if (axios.isAxiosError(e) && e.response) {
                return {
                    error: true,
                    status: e.response.status,
                    detail: e.response.data.detail || "An error occurred.",
                };
            } else {
                return {
                    error: true,
                    status: null,
                    detail: "An unexpected error occurred.",
                };
            }
        }
    };

    const deleteAccount = async () => {
        // Call the API to delete the account
        try {
            const result = await axios.delete(
                `${API_URL}/api/users/user/${authState.userId}/`
            );
            logout(); // Logout after deleting
            return {
                status: result.status,
            };
        } catch (e) {
            if (axios.isAxiosError(e) && e.response) {
                return {
                    error: true,
                    status: e.response.status,
                    detail: e.response.data.detail || "An error occurred.",
                };
            } else {
                return {
                    error: true,
                    status: null,
                    detail: "An unexpected error occurred.",
                };
            }
        }
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync(USER_ID_KEY);
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);

        axios.defaults.headers.common["Authorization"] = "";

        setAuthState({
            userId: null,
            accessToken: null,
            refreshToken: null,
            authenticated: false,
        });
    };

    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        onDelete: deleteAccount,
        authState,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
