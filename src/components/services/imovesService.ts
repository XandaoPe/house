import axios from 'axios';
import { Imovel } from '../../interfaces/Imovel';
import { api } from '../../services/api';

// const API_URL = 'https://imob-back-yc5k.onrender.com/imobs';
const API_URL = 'http://localhost:5000/imobs';

export const fetchImoveis = async (): Promise<Imovel[]> => {
    try {
        const response = await axios.get<Imovel[]>(API_URL);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar imóveis:', error);
        throw new Error('Falha ao conectar com o servidor.');
    }
};

export const createImovel = async (imovel: Omit<Imovel, '_id'>): Promise<Imovel> => {
    try {
        const response = await axios.post<Imovel>(API_URL, imovel);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar imóveis:', error);
        throw new Error('Falha ao conectar com o servidor.');
    }
};

export const updateImovel = async (imovel: Imovel): Promise<Imovel> => {
    try {
        const response = await axios.put<Imovel>(`${API_URL}/${imovel._id}`, imovel);
        return response.data;
    } catch (error) {
        console.error('Erro ao alterar imóveis:', error);
        throw new Error('Falha ao conectar com o servidor.');
    }
};

export const deleteImovel = async (id: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error('Erro ao deletar imóveis:', error);
        throw new Error('Falha ao conectar com o servidor.');
    }
};

export const fetchImobById = async (id: string): Promise<Imovel> => {
    try {
        const response = await api.get<Imovel>(`${API_URL}/${id}`);
        return response.data;
    } catch (error: any) {
        console.error('Erro ao buscar imóvel:', error);

        if (error.response?.status === 401) {
            throw new Error('Sessão expirada. Faça login novamente.');
        } else if (error.response?.status === 403) {
            throw new Error('Acesso negado. Você não possui permissão para visualizar imóvel.');
        } else {
            throw new Error('Falha ao conectar com o servidor.');
        }
    }
};

export const deactivateImovel = async (id: string): Promise<Imovel> => {
    try {
        const response = await api.patch<Imovel>(`${API_URL}/${id}/deactivate`);
        return response.data;
    } catch (error: any) {
        console.error('Erro ao desativar imóvel:', error);

        if (error.response?.status === 401) {
            throw new Error('Sessão expirada. Faça login novamente.');
        } else if (error.response?.status === 403) {
            throw new Error('Acesso negado. Você não possui permissão para desativar Imóvel.');
        } else {
            throw new Error('Falha ao conectar com o servidor.');
        }
    }
};

export const fetchAllImoveis = async (): Promise<Imovel[]> => {
    try {
        const response = await api.get<Imovel[]>(`${API_URL}/all`);
        return response.data;
    } catch (error: any) {
        console.error('Erro ao buscar todos os imóvel:', error);
        if (error.response?.status === 401) {
            throw new Error('Sessão expirada. Faça login novamente.');
        } else if (error.response?.status === 403) {
            throw new Error('Acesso negado. Você não possui permissão para visualizar todos os Imóvel.');
        } else {
            throw new Error('Falha ao conectar com o servidor.');
        }
    }
}

export const activateImovel = async (id: string): Promise<Imovel> => {
    try {
        const response = await api.patch<Imovel>(`${API_URL}/${id}/activate`);
        return response.data;
    } catch (error: any) {
        console.error('Erro ao ativar Imóvel:', error);
        if (error.response?.status === 401) {
            throw new Error('Sessão expirada. Faça login novamente.');
        } else if (error.response?.status === 403) {
            throw new Error('Acesso negado. Você não possui permissão para ativar Imóvel.');
        } else {
            throw new Error('Falha ao conectar com o servidor.');
        }
    }
};