import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing token on mount
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check if token is expired
                if (decoded.exp * 1000 > Date.now()) {
                    setUser({
                        userId: decoded.userId,
                        username: decoded.username,
                        role: decoded.role,
                    });
                } else {
                    localStorage.removeItem('token');
                }
            } catch (error) {
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await authAPI.login(username, password);
            const { token } = response.data.data;
            localStorage.setItem('token', token);

            const decoded = jwtDecode(token);
            setUser({
                userId: decoded.userId,
                username: decoded.username,
                role: decoded.role,
            });

            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed',
            };
        }
    };

    const register = async (username, password, role = 'USER') => {
        try {
            await authAPI.register(username, password, role);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed',
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const isAdmin = () => user?.role === 'ADMIN';

    return (
        <AuthContext.Provider
            value={{ user, loading, login, register, logout, isAdmin }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
