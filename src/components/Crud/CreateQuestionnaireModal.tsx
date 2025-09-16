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
import { createQuestionnaires } from '../services/QuestionnairesService';
import { Questionnaire } from '../../interfaces/questionnaire';
import { styleModal, textFieldSx } from '../../styles/styles';

interface CreateQuestionnaireModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (questionnaire: Questionnaire) => void;
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

export const CreateQuestionnaireModal: React.FC<CreateQuestionnaireModalProps> = ({ open, onClose, onSuccess }) => {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [formData, setFormData] = React.useState({
        question: '',
    });

    React.useEffect(() => {
        if (open) {
            setFormData({
                question: '',
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
            const newQuestionnaire = await createQuestionnaires(formData);
            onSuccess(newQuestionnaire); // Chama a função de sucesso do componente pai
            onClose(); // Fecha a modal
        } catch (err) {
            setError('Falha ao criar o questionário. Verifique os dados e tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle} component="form" onSubmit={handleSubmit}>
                <Typography variant="h6" component="h2">
                    Criar Novo Questionário
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <Box sx={{ ...textFieldSx, mb: 2, gap: 1, display: 'flex', flexDirection: 'column' }} >
                    <TextField
                        label="Pergunta"
                        name="question"
                        value={formData.question}
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