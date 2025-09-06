import { LoginData, AuthResponse } from '../types/auth';
import { api } from './api';

export const authService = {
    async login(loginData: LoginData): Promise<AuthResponse> {
        const response = await api.post('/auth/login', loginData);
        return response.data;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getStoredToken(): string | null {
        return localStorage.getItem('token');
    },

    getStoredUser(): any {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    storeAuthData(token: string, user: any) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    },
};