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
import { Imovel } from '../../interfaces/Imovel';
import { deleteImovel, fetchImoveis } from '../services/imovesService';
import { ImoveisTable } from '../tables/ImoveisTable';
import { CreateImovelModal } from '../Crud/CreateImovelModal';
import { EditImovelModal } from '../Crud/EditImovelModal';

interface ImoveisModalProps {
    open: boolean;
    onClose: () => void;
}

const modalStyle = {
    // position: 'absolute' as 'absolute',
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
    position: 'relative',
};

export const ImoveisModal: React.FC<ImoveisModalProps> = ({ open, onClose }) => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [imoveis, setImoveis] = React.useState<Imovel[]>([]);
    const [error, setError] = React.useState<string | null>(null);
    const [message, setMessage] = React.useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false); // Novo estado
    const [editingImovel, setEditingImovel] = React.useState<Imovel | null>(null); // Novo estado

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchImoveis();
            setImoveis(data);
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

    const handleCreateSuccess = (newImovel: Imovel) => {
        setMessage('Imóvel criado com sucesso!');
        setIsCreateModalOpen(false);
        loadData();
    };

    // Nova função para abrir a modal de edição
    const handleEdit = (imovel: Imovel) => {
        setEditingImovel(imovel); // Define o imóvel que será editado
    };

    // Função de sucesso da edição
    const handleEditSuccess = (updatedImovel: Imovel) => {
        setMessage('Imóvel atualizado com sucesso!');
        setEditingImovel(null); // Fecha a modal de edição
        loadData(); // Recarrega os dados para mostrar a alteração
    };

    const handleDelete = async (imovel: Imovel) => {
        setMessage(null);
        if (window.confirm(`Tem certeza que deseja excluir o imóvel em "${imovel.cidade}"?`)) {
            setLoading(true);
            try {
                await deleteImovel(imovel._id);
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
                        Lista de Imóveis IMOB
                    </Typography>
                    {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{ mb: 2 }}
                        onClick={handleCreate}
                    >
                        Criar Novo Imóvel
                    </Button>
                    {loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {!loading && !error && (
                        <ImoveisTable imoveis={imoveis} onEdit={handleEdit} onDelete={handleDelete} />
                    )}

                    <Button onClick={onClose} sx={{ mt: 2 }}>
                        Fechar
                    </Button>
                </Box>
            </Modal>
            <CreateImovelModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />
            {/* Modal de Edição */}
            <EditImovelModal
                open={!!editingImovel}
                imovel={editingImovel}
                onClose={() => setEditingImovel(null)}
                onSuccess={handleEditSuccess}
            />
        </>
    );
};