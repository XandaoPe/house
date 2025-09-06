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
import { Collaborator } from '../../interfaces/collaborators';
import { deleteCollaborators, fetchCollaborators } from '../services/CollaboratorsService';
import { CollaboratorsTable } from '../tables/CollaboratorsTable';
import { CreateCollaboratorModal } from '../Crud/CreateCollaboratorModal';
import { EditCollaboratorModal } from '../Crud/EditCollaboratorsModal';
import { useAuth } from '../../contexts/AuthContext';

interface collaboratorsModalProps {
    open: boolean;
    onClose: () => void;
}

const modalStyle = {
    position: 'relative',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: 350, sm: 600, md: 900, lg: 1200 },
    maxHeight: '90vh',
    overflowY: 'auto',
    bgcolor: '#e1d9d9f5',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export const CollaboratorsModal: React.FC<collaboratorsModalProps> = ({ open, onClose }) => {
    const { hasPermission } = useAuth();
    const canEdit = hasPermission('ADMIN');
    const [loading, setLoading] = React.useState<boolean>(false);
    const [collaborators, setCollaborators] = React.useState<Collaborator[]>([]);
    const [error, setError] = React.useState<string | null>(null);
    const [message, setMessage] = React.useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false); // Novo estado
    const [editingCollaborator, setEditingCollaborator] = React.useState<Collaborator | null>(null); // Novo estado

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchCollaborators();
            setCollaborators(data);
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

    const handleCreateSuccess = (newCollaborator: Collaborator) => {
        setMessage('Colaborador criado com sucesso!');
        setIsCreateModalOpen(false);
        loadData();
    };

    // Nova função para abrir a modal de edição
    const handleEdit = (collaborator: Collaborator) => {
        setEditingCollaborator(collaborator); // Define o imóvel que será editado
    };

    // Função de sucesso da edição
    const handleEditSuccess = (updatedcollaborator: Collaborator) => {
        setMessage('Imóvel atualizado com sucesso!');
        setEditingCollaborator(null); // Fecha a modal de edição
        loadData(); // Recarrega os dados para mostrar a alteração
    };

    const handleDelete = async (collaborator: Collaborator) => {
        setMessage(null);
        if (window.confirm(`Tem certeza que deseja excluir o colaborador "${collaborator.name}"?`)) {
            setLoading(true);
            try {
                await deleteCollaborators(collaborator._id);
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
                <Box sx={modalStyle}>
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
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" component="h2" mb={2}>
                        Lista de Colaboradores IMOB
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
                        Criar Novo Colaborador
                    </Button>
                    {loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {!loading && !error && (
                        <CollaboratorsTable collaborators={collaborators} onEdit={handleEdit} onDelete={handleDelete} />
                    )}

                    <Button onClick={onClose} sx={{ mt: 2 }}>
                        Fechar
                    </Button>
                </Box>
            </Modal>
            <CreateCollaboratorModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />
            {/* Modal de Edição */}
            <EditCollaboratorModal
                open={!!editingCollaborator}
                collaborator={editingCollaborator}
                onClose={() => setEditingCollaborator(null)}
                onSuccess={handleEditSuccess}
            />
        </>
    );
};