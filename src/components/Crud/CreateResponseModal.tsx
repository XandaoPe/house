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
import { styleModal, textFieldSx } from '../../styles/styles';

interface CreateResponseModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (response: Response) => void;
    questionId: any;
    questionDescription?: string;
}

const modalStyle = {
    ...styleModal,
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: 350, sm: 600, md: 900, lg: 1200 },
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
};

export const CreateResponseModal: React.FC<CreateResponseModalProps> = ({ open, onClose, onSuccess, questionId, questionDescription }) => {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [formData, setFormData] = React.useState({
        questionresponse: '',
        id_question: questionId, // [ALTERAÇÃO] Inicializa o estado com o ID da pergunta
    });

    React.useEffect(() => {
        if (open) {
            setFormData({
                questionresponse: '',
                id_question: questionId, // [ALTERAÇÃO] Re-inicializa o estado ao abrir, com o ID da prop
            });
            setError(null);
        }
    }, [open, questionId]); // Adiciona questionId como dependência

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
            // Não é mais necessário fazer formData.id_question = questionId;
            const newResponse = await createResponses(formData);
            onSuccess(newResponse);
            onClose();
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
                    {questionDescription} ?
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <Box sx={{ ...textFieldSx, mb: 2, gap: 1, display: 'flex', flexDirection: 'column' }} >
                    <TextField
                        label="Resposta"
                        name="questionresponse"
                        value={formData.questionresponse}
                        onChange={handleChange}
                        required
                        size="small"
                    />
                </Box>
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