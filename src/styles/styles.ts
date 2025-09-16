// src/styles/inputStyles.ts
import { SxProps, Theme } from '@mui/material';

export const textFieldSx: SxProps<Theme> = {
    input: {
        color: 'white',
        // --- Adicione estes estilos para corrigir o autocompletar ---
        '&:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 1000px #1e1e1e inset', // Cor de fundo do input (mesma do seu Paper)
            WebkitTextFillColor: 'white', // Cor do texto
            caretColor: 'white', // Cor do cursor
            transition: 'background-color 5000s ease-in-out 0s', // Transição para evitar mudança de cor brusca
        },
    },
    label: {
        color: 'gray',
        '&.Mui-focused': {
            color: 'white',
        },
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.5)',
        },
        '&:hover fieldset': {
            borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'white',
        },
        // --- Adicione este para garantir que a borda fique branca no autocompletar ---
        '&:-webkit-autofill:focus fieldset': {
            borderColor: 'white',
        },
    },
};

export const primaryButtonSx: SxProps<Theme> = {
    mt: 2,
    bgcolor: 'white',
    color: 'black',
    '&:hover': {
        bgcolor: '#f5f5f5', // Um cinza claro para o efeito de hover
    },
};

// Também podemos criar um estilo para quando o input for 'multiline'
export const multilineTextFieldSx: SxProps<Theme> = {
    textarea: { color: 'white' }, // Cor do texto digitado
    label: { color: 'white' }, // Cor do rótulo
    '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
        '&:hover fieldset': { borderColor: 'white' },
        '&.Mui-focused fieldset': { borderColor: 'white' },
    }
};

export const styleModal = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: 350, sm: 600, md: 900, lg: 1200 },
    bgcolor: 'rgba(0, 0, 0, 0.8)', // Fundo preto com 70% de opacidade
    color: 'white', // Cor das fontes em branco
    border: '2px solid #fff', // Borda branca
    // boxShadow: '0px 0px 30px 10px rgba(192, 192, 192, 0.7)', 
    boxShadow: '0px 0px 30px 10px rgba(97, 160, 243, 0.7)', 
    p: 4,
    borderRadius: '8px',
};

// Estilo para a tabela
export const tableContainerSx = {
    bgcolor: 'rgba(50, 50, 50, 0.7)', // Fundo cinza escuro transparente
    color: 'white', // Cor da fonte padrão para a tabela
    borderRadius: 2,
};

// Estilo para as células da tabela (cabeçalho e corpo)
export const tableCellSx = {
    py: 0.2,
    color: 'white',
    borderColor: 'rgba(255, 255, 255, 0.2)', // Borda clara e sutil
};

// Exemplo: tableStyles.ts

export const scrollableTableContainer = {
    maxHeight: '300px',
    overflowY: 'auto',
    // Estilos personalizados da barra de rolagem para navegadores WebKit
    '&::-webkit-scrollbar': {
        width: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
};