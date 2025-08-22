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
import { createCollaborators } from '../services/CollaboratorsService';
import { Collaborator } from '../../interfaces/collaborators';

interface CreateCollaboratorModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (collaborator: Collaborator) => void;
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
    gap: 1.5,
};

export const CreateCollaboratorModal: React.FC<CreateCollaboratorModalProps> = ({ open, onClose, onSuccess }) => {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        phone: '',
    });

    React.useEffect(() => {
        if (open) {
            setFormData({
                name: '',
                email: '',
                phone: '',
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
            const newCollaborator = await createCollaborators(formData);
            onSuccess(newCollaborator); // Chama a função de sucesso do componente pai
            onClose(); // Fecha a modal
        } catch (err) {
            setError('Falha ao criar o colaborador. Verifique os dados e tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle} component="form" onSubmit={handleSubmit}>
                <Typography variant="h6" component="h2">
                    Criar Novo Colaborador
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <TextField
                    label="Nome"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    size="small"
                />
                <TextField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    size="small"
                />
                <TextField
                    label="Fone"
                    name="phone"
                    value={formData.phone}
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