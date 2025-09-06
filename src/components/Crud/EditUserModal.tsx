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
import { updateUsers } from '../services/UsersService';
import { User } from '../../interfaces/users';

interface EditUserModalProps {
    open: boolean;
    user: User | null;
    onClose: () => void;
    onSuccess: (user: User) => void;
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

export const EditUserModal: React.FC<EditUserModalProps> = ({ open, user, onClose, onSuccess }) => {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [formData, setFormData] = React.useState<User | null>(null);

    React.useEffect(() => {
        if (user) {
            setFormData(user);
        }
    }, [user]);

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
            await updateUsers(formData);
            onSuccess(formData); // Chama o callback de sucesso com os dados atualizados
            onClose(); // Fecha a modal
        } catch (err) {
            setError('Falha ao atualizar o colaborador. Verifique os dados e tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle} component="form" onSubmit={handleSubmit}>
                <Typography variant="h6" component="h2">
                    Editar Colaborador
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
                    label="Fone'"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    size="small"
                />
                <TextField
                    label="CPF'"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    required
                    size="small"
                />
                <TextField
                    label="Cargo'"
                    name="cargo"
                    value={formData.cargo}
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