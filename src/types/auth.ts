export interface User {
    id: string;
    email: string;
    name: string;
    role: string; // Adicionar campo role
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
    hasPermission: (requiredRole: string) => boolean; // Nova função para verificar permissões
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    user?: User;
}
