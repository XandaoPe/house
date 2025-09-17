// services/cepService.ts
import axios from 'axios';

export const buscarEnderecoPorCep = async (cep: string) => {
    // Remove qualquer caractere que não seja um dígito do CEP
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
        throw new Error('CEP inválido.');
    }

    try {
        const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);

        // Verifica se a resposta contém um erro do ViaCEP
        if (response.data.erro) {
            throw new Error('CEP não encontrado.');
        }

        return {
            cidade: response.data.localidade,
            uf: response.data.uf,
        };
    } catch (error) {
        throw new Error('Falha ao buscar o CEP.');
    }
};