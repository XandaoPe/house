import axios from 'axios';
import { Imovel } from '../../interfaces/Imovel';
import { api } from '../../services/api'; // Sua instância customizada do Axios

const API_URL = 'http://localhost:5000/imobs'; // ou 'https://imob-back-yc5k.onrender.com/imobs'

// Interface para o resumo da importação
interface ImportSummary {
    created: number;
    updated: number;
    disabled: number; // Para imóveis desativados na importação
}

// Funções de CRUD existentes (com pequenas otimizações e padronização)

export const fetchImoveis = async (): Promise<Imovel[]> => {
    try {
        const response = await api.get<Imovel[]>(API_URL); // Usando 'api' para consistência
        return response.data;
    } catch (error: any) {
        console.error('Erro ao buscar imóveis:', error);
        if (error.response?.status === 401) {
            throw new Error('Sessão expirada. Faça login novamente.');
        } else if (error.response?.status === 403) {
            throw new Error('Acesso negado. Você não possui permissão para visualizar imóveis.');
        } else {
            throw new Error(error.response?.data?.message || 'Falha ao conectar com o servidor ao buscar imóveis.');
        }
    }
};

export const createImovel = async (imovel: Omit<Imovel, '_id' | 'createdAt' | 'updatedAt' | 'isDisabled'>): Promise<Imovel> => {
    try {
        const response = await api.post<Imovel>(API_URL, imovel); // Usando 'api' para consistência
        return response.data;
    } catch (error: any) {
        console.error('Erro ao criar imóvel:', error);
        if (error.response?.status === 401) {
            throw new Error('Sessão expirada. Faça login novamente.');
        } else if (error.response?.status === 403) {
            throw new Error('Acesso negado. Você não possui permissão para criar imóveis.');
        } else {
            throw new Error(error.response?.data?.message || 'Falha ao conectar com o servidor ao criar imóvel.');
        }
    }
};

export const updateImovel = async (imovel: Imovel): Promise<Imovel> => {
    try {
        const response = await api.put<Imovel>(`${API_URL}/${imovel._id}`, imovel); // Usando 'api' para consistência
        return response.data;
    } catch (error: any) {
        console.error('Erro ao alterar imóvel:', error);
        if (error.response?.status === 401) {
            throw new Error('Sessão expirada. Faça login novamente.');
        } else if (error.response?.status === 403) {
            throw new Error('Acesso negado. Você não possui permissão para alterar imóveis.');
        } else {
            throw new Error(error.response?.data?.message || 'Falha ao conectar com o servidor ao alterar imóvel.');
        }
    }
};

export const deleteImovel = async (id: string): Promise<void> => {
    try {
        await api.delete(`${API_URL}/${id}`); // Usando 'api' para consistência
    } catch (error: any) {
        console.error('Erro ao deletar imóvel:', error);
        if (error.response?.status === 401) {
            throw new Error('Sessão expirada. Faça login novamente.');
        } else if (error.response?.status === 403) {
            throw new Error('Acesso negado. Você não possui permissão para deletar imóveis.');
        } else {
            throw new Error(error.response?.data?.message || 'Falha ao conectar com o servidor ao deletar imóvel.');
        }
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
            throw new Error(error.response?.data?.message || 'Falha ao conectar com o servidor ao buscar imóvel.');
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
            throw new Error(error.response?.data?.message || 'Falha ao conectar com o servidor ao desativar imóvel.');
        }
    }
};

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
            throw new Error(error.response?.data?.message || 'Falha ao conectar com o servidor ao ativar imóvel.');
        }
    }
};

export const fetchAllImoveis = async (): Promise<Imovel[]> => {
    try {
        const response = await api.get<Imovel[]>(`${API_URL}/all`);
        return response.data;
    } catch (error: any) {
        console.error('Erro ao buscar todos os imóveis:', error);
        if (error.response?.status === 401) {
            throw new Error('Sessão expirada. Faça login novamente.');
        } else if (error.response?.status === 403) {
            throw new Error('Acesso negado. Você não possui permissão para visualizar todos os Imóveis.');
        } else {
            throw new Error(error.response?.data?.message || 'Falha ao conectar com o servidor ao buscar todos os imóveis.');
        }
    }
};

// Novas funções para importação e exportação de Excel

export const importImobsFromExcel = async (file: File): Promise<ImportSummary> => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post<ImportSummary>(`${API_URL}/import`, formData, { // Endpoint: /imobs/import
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error: any) {
        console.error('Erro ao importar imóveis do Excel:', error);
        if (error.response?.status === 401) {
            throw new Error('Sessão expirada. Faça login novamente.');
        } else if (error.response?.status === 403) {
            throw new Error('Acesso negado. Você não possui permissão para importar imóveis.');
        } else {
            // Se houver uma mensagem de erro específica no backend, ela será capturada aqui
            throw new Error(error.response?.data?.message || 'Erro ao importar imóveis do Excel. Verifique o formato do arquivo.');
        }
    }
};

export const exportImobsToExcel = async (): Promise<void> => {
    try {
        const response = await api.get(`${API_URL}/export`, { // Endpoint: /imobs/export
            responseType: 'blob', // Importante para lidar com o download de arquivos binários
        });

        // Lógica para criar e simular o clique em um link para download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'imoveis.xlsx'); // Nome do arquivo a ser baixado
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error: any) {
        console.error('Erro ao exportar imóveis para o Excel:', error);
        if (error.response?.status === 401) {
            throw new Error('Sessão expirada. Faça login novamente.');
        } else if (error.response?.status === 403) {
            throw new Error('Acesso negado. Você não possui permissão para exportar imóveis.');
        } else {
            throw new Error(error.response?.data?.message || 'Erro ao exportar imóveis para o Excel.');
        }
    }
};