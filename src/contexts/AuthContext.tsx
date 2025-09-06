import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const hasPermission = (requiredRole: string): boolean => {
        if (!user) return false;

        // Hierarquia de perfis (ajuste conforme suas necessidades)
        const roleHierarchy: { [key: string]: number } = {
            'USER': 1,
            'MODERATOR': 2,
            'ADMIN': 3,
            'SUPERADMIN': 4
        };

        const userRoleLevel = roleHierarchy[user.role] || 0;
        const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

        return userRoleLevel >= requiredRoleLevel;
        
    };

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.access_token) {
                    const userData: User = {
                        id: data.user.id,
                        email: data.user.email,
                        name: data.user.name,
                        role: data.user.roles // Incluir o role do usuário
                    };

                    setUser(userData);
                    setToken(data.access_token);
                    localStorage.setItem('user', JSON.stringify(userData));
                    localStorage.setItem('token', data.access_token);
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const value: AuthContextType = {
        user,
        token,
        login,
        logout,
        isLoading,
        hasPermission // Adicionar a função ao contexto
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};