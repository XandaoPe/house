import axios from 'axios';
import { Response } from '../../interfaces/response';

// const API_URL = 'https://imob-back-yc5k.onrender.com/responses';
const API_URL = 'http://localhost:5000/responses';

export const fetchResponses = async (): Promise<Response[]> => {
    try {
        const response = await axios.get<Response[]>(API_URL);
        return response.data;

    } catch (error) {
        console.error('Erro ao buscar questionarios:', error);
        throw new Error('Falha ao conectar com o servidor.');
    }
};

export const createResponses = async (responses: Omit<Response, '_id'>): Promise<Response> => {

    try {
        console.log('responses...', responses)
        const response = await axios.post<Response>(API_URL, responses);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar questionarioes:', error);
        throw new Error('Falha ao conectar com o servidor.');
    }
};

export const updateResponses = async (responses: Response): Promise<Response> => {
    try {
        const response = await axios.put<Response>(`${API_URL}/${responses._id}`, responses);
        return response.data;
    } catch (error) {
        console.error('Erro ao alterar questionario:', error);
        throw new Error('Falha ao conectar com o servidor.');
    }
};

export const deleteResponses = async (id: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error('Erro ao deletar questionarioes:', error);
        throw new Error('Falha ao conectar com o servidor.');
    }
};