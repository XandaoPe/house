// src/styles/inputStyles.ts
import { SxProps, Theme } from '@mui/material';

export const textFieldSx: SxProps<Theme> = {
    input: { color: 'white' }, // Cor do texto digitado
    label: { color: 'gray' }, // A cor do rótulo 'gray' original pode dificultar a leitura. 'white' é um contraste melhor.
    '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' }, // Borda mais visível
        '&:hover fieldset': { borderColor: 'white' }, // Borda ao passar o mouse
        '&.Mui-focused fieldset': { borderColor: 'white' }, // Borda ao focar
    }
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
    boxShadow: 24,
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