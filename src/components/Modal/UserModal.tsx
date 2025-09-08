import * as React from 'react';
import {
    Modal,
    Box,
    Typography,
    CircularProgress,
    Button,
    Alert,
    IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { User } from '../../interfaces/users';
import { deleteUsers, fetchUsers } from '../services/UsersService';
import { UsersTable } from '../tables/UsersTable';
import { CreateUserModal } from '../Crud/CreateUserModal';
import { EditUserModal } from '../Crud/EditUserModal';
import { useAuth } from '../../contexts/AuthContext';
import { styleModal } from '../../styles/styles';

interface usersModalProps {
    open: boolean;
    onClose: () => void;
}

export const UsersModal: React.FC<usersModalProps> = ({ open, onClose }) => {
    const { hasPermission } = useAuth();
    const canEdit = hasPermission('ADMIN');
    const [loading, setLoading] = React.useState<boolean>(false);
    const [users, setUsers] = React.useState<User[]>([]);
    const [error, setError] = React.useState<string | null>(null);
    const [message, setMessage] = React.useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false); // Novo estado
    const [editingUser, setEditingUser] = React.useState<User | null>(null); // Novo estado

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchUsers();
            setUsers(data);
        } catch (err) {
            setError('Não foi possível carregar os dados. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (open) {
            loadData();
        }
    }, [open]);
    React.useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 5000); // 5 segundos
            return () => clearTimeout(timer);
        }
    }, [message]);

    React.useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 5000); // 5 segundos
            return () => clearTimeout(timer);
        }
    }, [error]);
    const handleCreate = () => {
        setIsCreateModalOpen(true);
    };

    const handleCreateSuccess = (newUser: User) => {
        setMessage('Colaborador criado com sucesso!');
        setIsCreateModalOpen(false);
        loadData();
    };

    // Nova função para abrir a modal de edição
    const handleEdit = (user: User) => {
        setEditingUser(user); // Define o imóvel que será editado
    };

    // Função de sucesso da edição
    const handleEditSuccess = (updateduser: User) => {
        setMessage('Imóvel atualizado com sucesso!');
        setEditingUser(null); // Fecha a modal de edição
        loadData(); // Recarrega os dados para mostrar a alteração
    };

    const handleDelete = async (user: User) => {
        setMessage(null);
        if (window.confirm(`Tem certeza que deseja excluir o colaborador "${user.name}"?`)) {
            setLoading(true);
            try {
                await deleteUsers(user._id);
                await loadData();
                setMessage('Imóvel excluído com sucesso!');
            } catch (err) {
                setError('Falha ao excluir o imóvel.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Box sx={styleModal}>
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[900],
                        }}
                    >
                        <CloseIcon
                            sx={{ color: 'red' }}
                        />
                    </IconButton>
                    <Typography variant="h6" component="h2" mb={2}>
                        Lista de Usuários Casas
                    </Typography>
                    {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Button
                        disabled={!canEdit}
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{ mb: 2 }}
                        onClick={handleCreate}
                    >
                        Criar Novo Usuário
                    </Button>
                    {loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {!loading && !error && (
                        <UsersTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
                    )}

                    <Button
                        onClick={onClose}
                        variant="contained" // Adicionei 'contained' para dar um fundo vermelho
                        color="error" // Propriedade que define a cor para vermelho do tema
                        sx={{ mt: 2 }}
                    >
                        Fechar
                    </Button>

                </Box>
            </Modal>
            <CreateUserModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />
            {/* Modal de Edição */}
            <EditUserModal
                open={!!editingUser}
                user={editingUser}
                onClose={() => setEditingUser(null)}
                onSuccess={handleEditSuccess}
            />
        </>
    );
};