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
import { createResponses } from '../services/responseService';
import { Response } from '../../interfaces/response';

interface CreateResponseModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (response: Response) => void;
    questionId: any
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

export const CreateResponseModal: React.FC<CreateResponseModalProps> = ({ open, onClose, onSuccess, questionId }) => {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [formData, setFormData] = React.useState({
        questionresponse: '',
        id_question: '',
    });

    React.useEffect(() => {
        if (open) {
            setFormData({
                questionresponse: '',
                id_question: '',
            });
            setError(null); // Também é uma boa prática limpar o estado de erro
        }
    }, [open]);

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
            formData.id_question = questionId;
            const newResponse = await createResponses(formData);
            onSuccess(newResponse); // Chama a função de sucesso do componente pai
            onClose(); // Fecha a modal
        } catch (err) {
            setError('Falha ao criar a resposta. Verifique os dados e tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle} component="form" onSubmit={handleSubmit}>
                <Typography variant="h6" component="h2">
                    Criar Nova Resposta
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
                    {loading ? <CircularProgress size={24} /> : 'Salvar'}
                </Button>
                <Button onClick={onClose} variant="outlined">
                    Cancelar
                </Button>
            </Box>
        </Modal>
    );
};