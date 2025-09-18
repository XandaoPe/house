import { api } from '../../services/api'; // Importar a API configurada
import { User } from '../../interfaces/users';

const API_URL = '/users';

export const fetchUsers = async (): Promise<User[]> => {
    try {
        const response = await api.get<User[]>(API_URL);
        console.log('Dados recebidos do servidor:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Erro ao buscar usuários:', error);

        // Tratamento específico de erros
        if (error.response?.status === 401) {
            throw new Error('Sessão expirada. Faça login novamente.');
        } else if (error.response?.status === 403) {
            throw new Error('Acesso negado. Você não possui permissão para visualizar usuários.');
        } else {
            throw new Error('Falha ao conectar com o servidor.');
        }
    }
};

export const createUsers = async (users: Omit<User, '_id'>): Promise<User> => {
    try {
        const response = await api.post<User>(API_URL, users);
        return response.data;
    } catch (error: any) {
        console.error('Erro ao criar usuário:', error);

        if (error.response?.status === 401) {
            throw new Error('Sessão expirada. Faça login novamente.');
        } else if (error.response?.status === 403) {
            throw new Error('Acesso negado. Você não possui permissão para criar usuários.');
        } else {
            throw new Error('Falha ao conectar com o servidor.');
        }
    }
};

export const updateUsers = async (users: User): Promise<User> => {
    try {
        const response = await api.put<User>(`${API_URL}/${users._id}`, users);
        return response.data;
    } catch (error: any) {
        console.error('Erro ao alterar usuário:', error);

        if (error.response?.status === 401) {
            throw new Error('Sessão expirada. Faça login novamente.');
        } else if (error.response?.status === 403) {
            throw new Error('Acesso negado. Você não possui permissão para editar usuários.');
        } else {
            throw new Error('Falha ao conectar com o servidor.');
        }
    }
};

export const deleteUsers = async (id: string): Promise<void> => {
    try {
        await api.delete(`${API_URL}/${id}`);
    } catch (error: any) {
        console.error('Erro ao deletar usuário:', error);

        if (error.response?.status === 401) {
            throw new Error('Sessão expirada. Faça login novamente.');
        } else if (error.response?.status === 403) {
            throw new Error('Acesso negado. Você não possui permissão para deletar usuários.');
        } else {
            throw new Error('Falha ao conectar com o servidor.');
        }
    }
};

// Função adicional para buscar usuário por ID
export const fetchUserById = async (id: string): Promise<User> => {
    try {
        const response = await api.get<User>(`${API_URL}/${id}`);
        return response.data;
    } catch (error: any) {
        console.error('Erro ao buscar usuário:', error);

        if (error.response?.status === 401) {
            throw new Error('Sessão expirada. Faça login novamente.');
        } else if (error.response?.status === 403) {
            throw new Error('Acesso negado. Você não possui permissão para visualizar usuários.');
        } else {
            throw new Error('Falha ao conectar com o servidor.');
        }
    }
};

export const deactivateUser = async (id: string): Promise<User> => {
    try {
        const response = await api.patch<User>(`${API_URL}/${id}/deactivate`);
        return response.data;
    } catch (error: any) {
        console.error('Erro ao desativar usuário:', error);

        if (error.response?.status === 401) {
            throw new Error('Sessão expirada. Faça login novamente.');
        } else if (error.response?.status === 403) {
            throw new Error('Acesso negado. Você não possui permissão para desativar usuários.');
        } else {
            throw new Error('Falha ao conectar com o servidor.');
        }
    }
};