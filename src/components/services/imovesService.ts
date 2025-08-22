import axios from 'axios';
import { Imovel } from '../../interfaces/Imovel';

const API_URL = 'https://imob-back-yc5k.onrender.com/imobs';
// const API_URL = 'http://localhost:5000/imobs';

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