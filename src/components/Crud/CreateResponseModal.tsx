import * as React from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Alert,
} from '@mui/material';

// Assumindo que você terá um serviço para a API de respostas
import { createResponses } from '../services/responseService';

interface CreateResponseModalProps {
    open: boolean;
    responseId: any;
    onClose: () => void;
    onSuccess: (response: string) => void;
}

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5,
};

export const CreateResponseModal: React.FC<CreateResponseModalProps> = ({ open, responseId, onClose, onSuccess }) => {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [response, setResponse] = React.useState('');

    // Limpa o campo de input ao abrir a modal
    React.useEffect(() => {
        if (open) {
            setResponse('');
            setError(null);
        }
    }, [open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            // Chama a função de serviço para enviar a resposta para o backend
            await createResponses(responseId);
            onSuccess(response);
            onClose();
        } catch (err) {
            setError('Falha ao salvar a resposta. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle} component="form" onSubmit={handleSubmit}>
                <Typography variant="h6" component="h2">
                    Criar Resposta
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <TextField
                    label="Resposta"
                    name="response"
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    required
                    multiline
                    rows={4}
                />
                <Button type="submit" variant="contained" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Salvar Resposta'}
                </Button>
                <Button onClick={onClose} variant="outlined">
                    Cancelar
                </Button>
            </Box>
        </Modal>
    );
};