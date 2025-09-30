// src/services/imovesService.ts

import axios, { AxiosResponse } from 'axios'; // Importe Axios e AxiosResponse para tipagem, embora o 'api' já seja uma instância dele
import { Imovel } from '../../interfaces/Imovel';
import { api } from '../../services/api'; // Sua instância customizada do Axios, que já deve ter a base URL configurada.

// Se 'api' já tem a base URL configurada, a constante API_URL não precisa da URL completa,
// mas vou mantê-la como referência e usar o caminho relativo nos gets/posts para maior robustez,
// assumindo que a base URL está em api.
const API_BASE_PATH = '/imobs'; // Caminho base da rota de imóveis no seu backend

// Interface para o resumo da importação.
// Mantenho o 'disabled' para compatibilidade com o summary retornado pelo seu backend.
export interface ImportSummary {
    created: number;
    updated: number;
    disabled: number; // Para imóveis desativados na importação
    // Você pode adicionar 'ignored' ou 'errors' aqui se o backend retornar
}

// --- Funções de CRUD ---

export const fetchImoveis = async (): Promise<Imovel[]> => {
    try {
        // Assume que este endpoint retorna apenas ativos ou todos, dependendo da configuração do backend.
        const response: AxiosResponse<Imovel[]> = await api.get(API_BASE_PATH);
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
        const response: AxiosResponse<Imovel> = await api.post(API_BASE_PATH, imovel);
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
        const response: AxiosResponse<Imovel> = await api.put(`${API_BASE_PATH}/${imovel._id}`, imovel);
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
        await api.delete(`${API_BASE_PATH}/${id}`);
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
        const response: AxiosResponse<Imovel> = await api.get(`${API_BASE_PATH}/${id}`);
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
        const response: AxiosResponse<Imovel> = await api.patch(`${API_BASE_PATH}/${id}/deactivate`);
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
        const response: AxiosResponse<Imovel> = await api.patch(`${API_BASE_PATH}/${id}/activate`);
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

// Esta função é importante para a tabela, pois retorna ativos e inativos,
// crucial para o cálculo dos contadores e exportação.
export const fetchAllImoveis = async (): Promise<Imovel[]> => {
    try {
        const response: AxiosResponse<Imovel[]> = await api.get(`${API_BASE_PATH}/all`);
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

// --- Funções de Importação e Exportação de Excel (Já estavam corretas) ---

export const importImobsFromExcel = async (file: File): Promise<ImportSummary> => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        // Endpoint: /imobs/import
        const response: AxiosResponse<ImportSummary> = await api.post(`${API_BASE_PATH}/import`, formData, {
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
        // Endpoint: /imobs/export
        const response: AxiosResponse<Blob> = await api.get(`${API_BASE_PATH}/export`, {
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