export const handleApiError = (error: any): string => {
    if (error.response?.status === 403) {
        return 'Acesso negado. Você não possui permissão para realizar esta ação.';
    }
    if (error.response?.status === 401) {
        return 'Sessão expirada. Faça login novamente.';
    }
    return 'Erro ao conectar com o servidor. Tente novamente.';
};