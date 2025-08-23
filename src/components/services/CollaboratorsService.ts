import axios from 'axios';
import { Collaborator } from '../../interfaces/collaborators';

// const API_URL = 'https://imob-back-yc5k.onrender.com/collaborators';
const API_URL = 'http://localhost:5000/collaborators';

export const fetchCollaborators = async (): Promise<Collaborator[]> => {
    try {
        const response = await axios.get<Collaborator[]>(API_URL);
        return response.data;

    } catch (error) {
        console.error('Erro ao buscar colaboradores:', error);
        throw new Error('Falha ao conectar com o servidor.');
    }
};

export const createCollaborators = async (collaborators: Omit<Collaborator, '_id'>): Promise<Collaborator> => {

    try {
        const response = await axios.post<Collaborator>(API_URL, collaborators);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar colaboradores:', error);
        throw new Error('Falha ao conectar com o servidor.');
    }
};

export const updateCollaborators = async (collaborators: Collaborator): Promise<Collaborator> => {
    try {
        const response = await axios.put<Collaborator>(`${API_URL}/${collaborators._id}`, collaborators);
        return response.data;
    } catch (error) {
        console.error('Erro ao alterar colaborador:', error);
        throw new Error('Falha ao conectar com o servidor.');
    }
};

export const deleteCollaborators = async (id: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error('Erro ao deletar colaboradores:', error);
        throw new Error('Falha ao conectar com o servidor.');
    }
};