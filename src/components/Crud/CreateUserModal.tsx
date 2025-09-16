import * as React from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    OutlinedInput,
    Chip,
} from '@mui/material';
import { createUsers } from '../services/UsersService';
import { User } from '../../interfaces/users';
import { styleModal, textFieldSx } from '../../styles/styles';

interface CreateUserModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (user: User) => void;
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

const allRoles = ['ADMIN', 'MODERATOR', 'USER'];

export const CreateUserModal: React.FC<CreateUserModalProps> = ({ open, onClose, onSuccess }) => {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        phone: '',
        cpf: '',
        cargo: '',
        roles: ['USER'], // Inicia com o perfil padrão
        password: '123456', // Senha padrão inicial
    });

    React.useEffect(() => {
        if (open) {
            setFormData({
                name: '',
                email: '',
                phone: '',
                cpf: '',
                cargo: '',
                roles: ['USER'],
                password: '123456',
            });
            setError(null);
        }
    }, [open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRolesChange = (e: any) => {
        const {
            target: { value },
        } = e;
        setFormData({
            ...formData,
            roles: typeof value === 'string' ? value.split(',') : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const newUser = await createUsers(formData);
            onSuccess(newUser);
            onClose();
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Falha ao criar o colaborador. Verifique os dados e tente novamente.';
            setError(errorMessage);
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
                <Box sx={{ ...textFieldSx, mb: 2, gap: 1, display: 'flex', flexDirection: 'column' }} >
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
                    <TextField
                        label="CPF"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleChange}
                        required
                        size="small"
                    />
                    <TextField
                        label="Cargo"
                        name="cargo"
                        value={formData.cargo}
                        onChange={handleChange}
                        required
                        size="small"
                    />
                    <FormControl fullWidth size="small">
                        <InputLabel id="roles-label">Perfis</InputLabel>
                        <Select
                            labelId="roles-label"
                            id="roles-select"
                            multiple
                            value={formData.roles}
                            onChange={handleRolesChange}
                            input={<OutlinedInput id="select-multiple-chip" label="Perfis" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                    ))}
                                </Box>
                            )}
                        >
                            {allRoles.map((role) => (
                                <MenuItem key={role} value={role}>
                                    {role}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{ mt: 2 }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Salvar'}
                </Button>
                <Button onClick={onClose} variant="outlined" sx={{ mt: 1 }}>
                    Cancelar
                </Button>
            </Box>
        </Modal>
    );
};