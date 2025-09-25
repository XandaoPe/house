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
import PeopleIcon from '@mui/icons-material/People'; // Ícone para "Mostrar Todos"
import { toast } from 'react-toastify'; // Importar toast

interface ImoveisModalProps {
    open: boolean;
    onClose: () => void;
}

export const ImoveisModal: React.FC<ImoveisModalProps> = ({ open, onClose }) => {
    const { hasPermission } = useAuth();
    const canEdit = hasPermission('ADMIN'); // Verifique se esta permissão é adequada para criar/editar
    const [loading, setLoading] = React.useState<boolean>(false);
    const [imoveis, setImoveis] = React.useState<Imovel[]>([]);
    const [error, setError] = React.useState<string | null>(null);
    const [message, setMessage] = React.useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
    const [editingImovel, setEditingImovel] = React.useState<Imovel | null>(null);
    const [showDisabledImovel, setShowDisabledImovel] = React.useState(false);

    // Usa useCallback para memoizar a função loadData
    const loadData = React.useCallback(async () => {
        setLoading(true);
        setError(null);
        setMessage(null); // Limpar mensagens anteriores ao recarregar
        try {
            const data = showDisabledImovel ? await fetchAllImoveis() : await fetchImoveis();
            setImoveis(data);
        } catch (err: any) { // Tipar o erro para acessar .message
            setError(err.message || 'Não foi possível carregar os dados. Tente novamente.');
            toast.error(err.message || 'Não foi possível carregar os dados. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }, [showDisabledImovel]); // Dependência para recarregar quando o toggle muda

    React.useEffect(() => {
        if (open) {
            loadData();
        }
    }, [open, loadData]); // Adicione loadData às dependências, pois agora é useCallback

    // Mantenha os useEffects para as mensagens de sucesso/erro (com toast, eles podem ser menos críticos aqui)
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

    const handleCreateSuccess = (newImovel: Imovel) => {
        toast.success('Imóvel criado com sucesso!'); // Usar toast
        setMessage('Imóvel criado com sucesso!'); // Manter para a Alert interna se preferir
        setIsCreateModalOpen(false);
        loadData(); // Recarregar dados
    };

    const handleEdit = (imovel: Imovel) => {
        setEditingImovel(imovel);
    };

    const handleEditSuccess = (updatedImovel: Imovel) => {
        toast.success('Imóvel atualizado com sucesso!'); // Usar toast
        setMessage('Imóvel atualizado com sucesso!'); // Manter para a Alert interna
        setEditingImovel(null);
        loadData(); // Recarregar dados
    };

    const handleDelete = async (imovel: Imovel) => {
        // setMessage(null); // Opcional: limpar mensagem antes de nova ação
        if (window.confirm(`Tem certeza que deseja excluir o imóvel em "${imovel.cidade}"?`)) {
            setLoading(true);
            try {
                await deleteImovel(imovel._id!); // _id não deve ser null aqui
                await loadData();
                toast.success('Imóvel excluído com sucesso!'); // Usar toast
                setMessage('Imóvel excluído com sucesso!'); // Manter para a Alert interna
            } catch (err: any) {
                toast.error(err.message || 'Falha ao excluir o imóvel.'); // Usar toast
                setError(err.message || 'Falha ao excluir o imóvel.'); // Manter para a Alert interna
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDeactivate = async (imovel: Imovel) => {
        // setMessage(null);
        if (window.confirm(`Tem certeza que deseja desativar o imóvel "${imovel.tipo}"?`)) {
            setLoading(true);
            try {
                await deactivateImovel(imovel._id!);
                await loadData();
                toast.success('Imóvel desativado com sucesso!');
                setMessage('Imóvel desativado com sucesso!');
            } catch (err: any) {
                toast.error(err.message || 'Falha ao desativar o Imóvel.');
                setError(err.message || 'Falha ao desativar o Imóvel.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleActivate = async (imovel: Imovel) => {
        // setMessage(null);
        if (window.confirm(`Tem certeza que deseja ativar o imóvel "${imovel.tipo}"?`)) {
            setLoading(true);
            try {
                await activateImovel(imovel._id!);
                await loadData();
                toast.success('Imóvel ativado com sucesso!');
                setMessage('Imóvel ativado com sucesso!');
            } catch (err: any) {
                toast.error(err.message || 'Falha ao ativar o imóvel.');
                setError(err.message || 'Falha ao ativar o imóvel.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleToggleDisabled = () => {
        setShowDisabledImovel(prevState => !prevState);
        // Não é necessário chamar loadData aqui, pois a mudança de showDisabledImovel
        // já é uma dependência do useCallback de loadData, que será chamado no useEffect.
    };

    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Box sx={styleModal}>
                    <IconButton
                        aria-label="close"
                        onClick={() => {
                            onClose();
                            setShowDisabledImovel(false); // Resetar estado ao fechar
                        }}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[900], // Ajuste de cor para ser visível
                        }}
                    >
                        <CloseIcon sx={{ color: 'red' }} />
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
                            color={showDisabledImovel ? "info" : "primary"}
                            startIcon={<PeopleIcon />}
                            sx={{
                                py: 0.2,
                                px: 1,
                                fontSize: '0.75rem'
                            }}
                        >
                            {showDisabledImovel ? 'Listar Apenas Ativos' : 'Listar Todos (Ativos e Inativos)'}
                        </Button>
                        <Button
                            disabled={!canEdit}
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleCreate}
                            sx={{
                                py: 0.2,
                                px: 1,
                                fontSize: '0.75rem'
                            }}
                        >
                            Criar Novo Imóvel {/* Texto ajustado para Imóvel */}
                        </Button>
                    </Box>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <ImoveisTable
                            imoveis={imoveis}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onDeactivate={handleDeactivate}
                            onActivate={handleActivate}
                            showDisabledImoveis={showDisabledImovel}
                            onImobsReload={loadData} 
                        />
                    )}

                    <Button
                        onClick={() => {
                            onClose();
                            setShowDisabledImovel(false); // Resetar estado ao fechar
                        }}
                        variant="contained"
                        color="error"
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
            <EditImovelModal
                open={!!editingImovel}
                imovel={editingImovel}
                onClose={() => setEditingImovel(null)}
                onSuccess={handleEditSuccess}
            />
        </>
    );
};