import * as React from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
} from '@mui/material';
import { updateResponses } from '../services/responseService';
import { Response } from '../../interfaces/response';

interface EditResponseModalProps {
    open: boolean;
    response: Response | null;
    onClose: () => void;
    onSuccess: (response: Response) => void;
}

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: 350, sm: 600, md: 900, lg: 1200 },
    bgcolor: '#e1d9d9f5',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
};

export const EditResponseModal: React.FC<EditResponseModalProps> = ({ open, response, onClose, onSuccess }) => {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [formData, setFormData] = React.useState<Response | null>(null);

    React.useEffect(() => {
        if (response) {
            setFormData(response);
        }
    }, [response]);

    if (!formData) {
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await updateResponses(formData);
            onSuccess(formData); // Chama o callback de sucesso com os dados atualizados
            onClose(); // Fecha a modal
        } catch (err) {
            setError('Falha ao atualizar o Resposta. Verifique os dados e tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle} component="form" onSubmit={handleSubmit}>
                <Typography variant="h6" component="h2">
                    Editar Imóvel
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <TextField
                    label="Resposta"
                    name="questionresponse"
                    value={formData.questionresponse}
                    onChange={handleChange}
                    required
                    size="small"
                />
                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Salvar Alterações'}
                </Button>
                <Button onClick={onClose} variant="outlined">
                    Cancelar
                </Button>
            </Box>
        </Modal>
    );
};