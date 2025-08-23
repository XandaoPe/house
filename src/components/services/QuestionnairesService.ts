import axios from 'axios';
import { Questionnaire } from '../../interfaces/questionnaire';

// const API_URL = 'https://imob-back-yc5k.onrender.com/questionnaires';
const API_URL = 'http://localhost:5000/questionnaires';

export const fetchQuestionnaires = async (): Promise<Questionnaire[]> => {
    try {
        const response = await axios.get<Questionnaire[]>(API_URL);
        return response.data;

    } catch (error) {
        console.error('Erro ao buscar questionarioes:', error);
        throw new Error('Falha ao conectar com o servidor.');
    }
};

export const createQuestionnaires = async (questionnaires: Omit<Questionnaire, '_id'>): Promise<Questionnaire> => {

    try {
        const response = await axios.post<Questionnaire>(API_URL, questionnaires);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar questionarioes:', error);
        throw new Error('Falha ao conectar com o servidor.');
    }
};

export const updateQuestionnaires = async (questionnaires: Questionnaire): Promise<Questionnaire> => {
    try {
        const response = await axios.put<Questionnaire>(`${API_URL}/${questionnaires._id}`, questionnaires);
        return response.data;
    } catch (error) {
        console.error('Erro ao alterar questionario:', error);
        throw new Error('Falha ao conectar com o servidor.');
    }
};

export const deleteQuestionnaires = async (id: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error('Erro ao deletar questionarioes:', error);
        throw new Error('Falha ao conectar com o servidor.');
    }
};