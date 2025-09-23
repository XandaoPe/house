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
import { deleteUsers, fetchUsers, deactivateUser, fetchAllUsers, activateUser } from '../services/UsersService';
import { UsersTable } from '../tables/UsersTable';
import { CreateUserModal } from '../Crud/CreateUserModal';
import { EditUserModal } from '../Crud/EditUserModal';
import { useAuth } from '../../contexts/AuthContext';
import { styleModal } from '../../styles/styles';
import PeopleIcon from '@mui/icons-material/People';

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
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
    const [editingUser, setEditingUser] = React.useState<User | null>(null);
    const [showDisabledUsers, setShowDisabledUsers] = React.useState(false);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = showDisabledUsers ? await fetchAllUsers() : await fetchUsers();
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
    }, [open, showDisabledUsers]);

    React.useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    React.useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 5000);
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

    const handleEdit = (user: User) => {
        setEditingUser(user);
    };

    const handleEditSuccess = (updateduser: User) => {
        setMessage('Imóvel atualizado com sucesso!');
        setEditingUser(null);
        loadData();
    };

    const handleDelete = async (user: User) => {
        setMessage(null);
        if (window.confirm(`Tem certeza que deseja excluir o usuário "${user.name}"?`)) {
            setLoading(true);
            try {
                await deleteUsers(user._id);
                await loadData();
                setMessage('Usuário excluído com sucesso!');
            } catch (err) {
                setError('Falha ao excluir o imóvel.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDeactivate = async (user: User) => {
        setMessage(null);
        if (window.confirm(`Tem certeza que deseja desativar o colaborador "${user.name}"?`)) {
            setLoading(true);
            try {
                await deactivateUser(user._id);
                await loadData();
                setMessage('Colaborador desativado com sucesso!');
            } catch (err) {
                setError('Falha ao desativar o colaborador.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleActivate = async (user: User) => {
        setMessage(null);
        if (window.confirm(`Tem certeza que deseja ativar o colaborador "${user.name}"?`)) {
            setLoading(true);
            try {
                await activateUser(user._id);
                await loadData();
                setMessage('Colaborador ativado com sucesso!');
            } catch (err) {
                setError('Falha ao ativar o colaborador.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleToggleDisabled = () => {
        setShowDisabledUsers(prevState => !prevState);
    };

    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Box sx={styleModal}>
                    <IconButton
                        aria-label="close"
                        onClick={() => {
                            onClose();
                            setShowDisabledUsers(false);
                        }}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[900],
                        }}
                    >
                        <CloseIcon sx={{ color: 'red' }} />
                    </IconButton>
                    <Typography variant="h6" component="h2">
                        Lista de Usuários
                    </Typography>
                    {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    {/* 🔥 ALTERADO: Novo layout para os botões "Criar Novo" e "Listar Todos" */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
                        <Button
                            variant="contained"
                            onClick={handleToggleDisabled}
                            color={showDisabledUsers ? "info" : "primary"} // Ajuste de cores
                            startIcon={<PeopleIcon />}
                            sx={{
                                py: 0.2, // Reduz o padding vertical para alinhar melhor
                                px: 1, // Reduz o padding horizontal
                                fontSize: '0.75rem' // Ajusta o tamanho da fonte para o botão pequeno
                            }}
                        >
                            {showDisabledUsers ? 'Listar Ativos' : 'Listar Todos'}
                        </Button>
                        <Button
                            disabled={!canEdit}
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleCreate}
                            sx={{
                                py: 0.2, // Reduz o padding vertical para alinhar melhor
                                px: 1, // Reduz o padding horizontal
                                fontSize: '0.75rem' // Ajusta o tamanho da fonte para o botão pequeno
                            }}
                        >
                            Criar Novo Usuário
                        </Button>
                    </Box>

                    {loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {!loading && !error && (
                        <UsersTable
                            users={users}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onDeactivate={handleDeactivate}
                            onActivate={handleActivate}
                            showDisabledUsers={showDisabledUsers}
                            onUsersReload={loadData}
                        />
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                            onClick={() => {
                                onClose();
                                setShowDisabledUsers(false);
                            }}
                            variant="contained"
                            color="error"
                        >
                            Fechar
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <CreateUserModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />
            <EditUserModal
                open={!!editingUser}
                user={editingUser}
                onClose={() => setEditingUser(null)}
                onSuccess={handleEditSuccess}
            />
        </>
    );
};