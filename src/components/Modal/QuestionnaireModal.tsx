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
import { Questionnaire } from '../../interfaces/questionnaire';
import { deleteQuestionnaires, fetchQuestionnaires } from '../services/QuestionnairesService';
import { QuestionnairesTable } from '../tables/QuestionnairesTable';
import { CreateQuestionnaireModal } from '../Crud/CreateQuestionnaireModal';
import { EditQuestionnaireModal } from '../Crud/EditQuestionnaireModal';
import { Response } from '../../interfaces/response';
import { CreateResponseModal } from '../Crud/CreateResponseModal';
import { useAuth } from '../../contexts/AuthContext';
import { styleModal } from '../../styles/styles';

interface questionnairesModalProps {
    open: boolean;
    onClose: () => void;
}

export const QuestionnairesModal: React.FC<questionnairesModalProps> = ({ open, onClose}) => {
    const { hasPermission } = useAuth();
    const canEdit = hasPermission('ADMIN');
    const [loading, setLoading] = React.useState<boolean>(false);
    const [questionnaires, setQuestionnaires] = React.useState<Questionnaire[]>([]);
    const [error, setError] = React.useState<string | null>(null);
    const [message, setMessage] = React.useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
    const [editingQuestionnaire, setEditingQuestionnaire] = React.useState<Questionnaire | null>(null); // Novo estado
    const [response, setResponse] = React.useState(false);
    const [questionId, setQuestionId] = React.useState<any | null>();

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchQuestionnaires();
            setQuestionnaires(data);
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

    const handleCreateSuccess = (newQuestionnaire: Questionnaire) => {
        setMessage('Questionario criado com sucesso!');
        setIsCreateModalOpen(false);
        loadData();
    };

    // Nova função para abrir a modal de edição
    const handleEdit = (questionnaire: Questionnaire) => {
        setEditingQuestionnaire(questionnaire); // Define o imóvel que será editado
    };

    // Função de sucesso da edição
    const handleEditSuccess = (updatedquestionnaire: Questionnaire) => {
        setMessage('Imóvel atualizado com sucesso!');
        setEditingQuestionnaire(null); // Fecha a modal de edição
        loadData(); // Recarrega os dados para mostrar a alteração
    };

    const handleDelete = async (questionnaire: Questionnaire) => {
        setMessage(null);
        if (window.confirm(`Tem certeza que deseja excluir o questionario "${questionnaire.question}"?`)) {
            setLoading(true);
            try {
                await deleteQuestionnaires(questionnaire._id);
                await loadData();
                setMessage('Questão excluída com sucesso!');
            } catch (err) {
                setError('Falha ao excluir o Questão.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleResponse = () => {
        setResponse(true);
    };

    const handleResponseSuccess = (createResponse: Response) => {
        setMessage('Resposta criada com sucesso!');
        setResponse(false); // Fecha a modal de edição
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
                        />                    </IconButton>
                    <Typography variant="h6" component="h2" mb={2}>
                        Lista de Questionários IMOB
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
                        Criar Novo Questionário
                    </Button>
                    {loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {/* {!loading && !error && (
                        <QuestionnairesTable 
                        questionnaires={questionnaires} 
                        onEdit={handleEdit} 
                        onDelete={handleDelete}
                            questionId={setQuestionId, handleResponse}
                        />
                    )} */}

                    <QuestionnairesTable
                        questionnaires={questionnaires}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        responseHandler={{ setQuestionId, handleResponse }}                        
                    />

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
            <CreateQuestionnaireModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />
            {/* Modal de Edição */}
            <EditQuestionnaireModal
                open={!!editingQuestionnaire}
                questionnaire={editingQuestionnaire}
                onClose={() => setEditingQuestionnaire(null)}
                onSuccess={handleEditSuccess}
            />
            <CreateResponseModal
                open={!!response}
                onClose={() => setResponse(false)}
                onSuccess={handleResponseSuccess}
                questionId={questionId}
            />
        </>
    );
};