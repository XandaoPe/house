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
import { activateImovel, deactivateImovel, deleteImovel, fetchAllImoveis, fetchImoveis } from '../services/imovesService';
import { ImoveisTable } from '../tables/ImoveisTable';
import { CreateImovelModal } from '../Crud/CreateImovelModal';
import { EditImovelModal } from '../Crud/EditImovelModal';
import { useAuth } from '../../contexts/AuthContext';
import { styleModal } from '../../styles/styles';
import PeopleIcon from '@mui/icons-material/People';

interface ImoveisModalProps {
    open: boolean;
    onClose: () => void;
}

export const ImoveisModal: React.FC<ImoveisModalProps> = ({ open, onClose }) => {
    const { hasPermission } = useAuth();
    const canEdit = hasPermission('ADMIN');
    const [loading, setLoading] = React.useState<boolean>(false);
    const [imoveis, setImoveis] = React.useState<Imovel[]>([]);
    const [error, setError] = React.useState<string | null>(null);
    const [message, setMessage] = React.useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false); // Novo estado
    const [editingImovel, setEditingImovel] = React.useState<Imovel | null>(null); // Novo estado
    const [showDisabledImovel, setShowDisabledImovel] = React.useState(false);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = showDisabledImovel ? await fetchAllImoveis() : await fetchImoveis();
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
    }, [open, showDisabledImovel]);

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

    const handleDeactivate = async (imovel: Imovel) => {
        setMessage(null);
        if (window.confirm(`Tem certeza que deseja desativar o imóvel "${imovel.tipo}"?`)) {
            setLoading(true);
            try {
                await deactivateImovel(imovel._id);
                await loadData();
                setMessage('Imóvel desativado com sucesso!');
            } catch (err) {
                setError('Falha ao desativar o Imóvel.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleActivate = async (imovel: Imovel) => {
        setMessage(null);
        if (window.confirm(`Tem certeza que deseja ativar o imóvel "${imovel.tipo}"?`)) {
            setLoading(true);
            try {
                await activateImovel(imovel._id);
                await loadData();
                setMessage('Imóvel ativado com sucesso!');
            } catch (err) {
                setError('Falha ao ativar o imóvel.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleToggleDisabled = () => {
        setShowDisabledImovel(prevState => !prevState);
    };

    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Box sx={styleModal}>
                    <IconButton
                        aria-label="close"
                        onClick={() => {
                            onClose();
                            setShowDisabledImovel(false);
                        }}
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
                        Lista de Imóveis IMOB
                    </Typography>
                    {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
                        <Button
                            variant="contained"
                            onClick={handleToggleDisabled}
                            color={showDisabledImovel ? "info" : "primary"} // Ajuste de cores
                            startIcon={<PeopleIcon />}
                            sx={{
                                py: 0.2, // Reduz o padding vertical para alinhar melhor
                                px: 1, // Reduz o padding horizontal
                                fontSize: '0.75rem' // Ajusta o tamanho da fonte para o botão pequeno
                            }}
                        >
                            {showDisabledImovel ? 'Listar Ativos' : 'Listar Ativos e Inativos'}
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

                    {!loading && !error && (
                        <ImoveisTable
                            imoveis={imoveis}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onDeactivate={handleDeactivate}
                            onActivate={handleActivate}
                            showDisabledImoveis={showDisabledImovel}
                        />
                    )}

                    <Button
                        onClick={() => {
                            onClose();
                            setShowDisabledImovel(false);
                        }}
                        variant="contained" // Adicionei 'contained' para dar um fundo vermelho
                        color="error" // Propriedade que define a cor para vermelho do tema
                        sx={{ mt: 2 }}
                    >
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