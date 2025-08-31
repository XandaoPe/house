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
import SyncIcon from '@mui/icons-material/Sync';
import { Response } from '../../interfaces/response';
import { deleteResponses, fetchResponses } from '../services/responseService';
import { fetchQuestionnaires } from '../services/QuestionnairesService';

import { ResponsequestionsTable } from '../tables/ResponseQuestionsTable';
import { Questionnaire } from '../../interfaces/questionnaire';
import { ResponsesModal } from './ResponseModal';
import { QuestionnairesModal } from './QuestionnaireModal';

interface ResponsequestionsModalProps {
    open: boolean;
    onClose: () => void;
    responseArray?: [];
}

const modalStyle = {
    // position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: 250, sm: 400, md: 750, lg: 1000 },
    maxHeight: '90vh',
    overflowY: 'auto',
    bgcolor: '#e1d9d9f5',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    position: 'relative',
};

export const ResponseQuestionsModal: React.FC<ResponsequestionsModalProps> = ({ open, onClose, responseArray }) => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [responsequestions, setResponsequestions] = React.useState<Response[]>([]);
    const [questions, setQuestions] = React.useState<Questionnaire[]>([]);
    const [responsesArray, setResponsesArray] = React.useState<any>([]);
    const [atualiza, setAtualiza] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [message, setMessage] = React.useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false); // Novo estado
    const [editingResponsequestions, setEditingResponsequestions] = React.useState<Response | null>(null);
    const [isModalOpenResponses, setIsModalOpenResponses] = React.useState<boolean>(false);
    const [isModalOpenQuestionnaires, setIsModalOpenQuestionnaires] = React.useState<boolean>(false);
    const handleOpenModalResponses = () => setIsModalOpenResponses(true);
    const handleCloseModalResponses = () => setIsModalOpenResponses(false);
    const handleOpenModalQuestionnaires = () => setIsModalOpenQuestionnaires(true);
    const handleCloseModalQuestionnaires = () => setIsModalOpenQuestionnaires(false);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchResponses();
            setResponsequestions(data);
        } catch (err) {
            setError('Não foi possível carregar os dados. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const loadDataQuestion = async () => {
        setLoading(true);
        setError(null);
        try {
            const dataQuestion = await fetchQuestionnaires();
            const dataResponse = await fetchResponses()
            let allResponse: any = [];
            let allRecords: any = [];

            dataQuestion.map((uniQuestion) => {
                dataResponse.map((uniResponse) => {
                    if (uniResponse.id_question._id === uniQuestion._id) {
                        allResponse.push(
                            {
                                id_response: uniResponse.id_question._id,
                                response: uniResponse.questionresponse,
                            }
                        )
                    }
                })
                allRecords.push(
                    {
                        question: uniQuestion.question,
                        response: allResponse
                    }
                )
                allResponse = []
            })
            const sortedQuestions = [...dataQuestion];
            sortedQuestions.sort((a, b) => a.question.localeCompare(b.question));
            const sortedResponses = [...allRecords];
            sortedResponses.sort((a, b) => a.question.localeCompare(b.question));
            setQuestions(sortedQuestions);
            setResponsesArray(sortedResponses);
            console.log('responseArray...', responsesArray)
        } catch (err) {
            setError('Não foi possível carregar os dados. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };


    React.useEffect(() => {
        if (open) {
            loadData();
            loadDataQuestion();
            setAtualiza(false)
        }
    }, [open, atualiza]);

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

    const handleAtualiza = () => {
        setAtualiza(true);
    };

    const handleCreateSuccess = (newResponsequestions: Response) => {
        setMessage('Resposta criada com sucesso!');
        setIsCreateModalOpen(false);
        loadData();
    };

    // Nova função para abrir a modal de edição
    // const handleEdit = (responsequestions: Response) => {
    //     setEditingResponsequestions(responsequestions); // Define o imóvel que será editado
    // };

    // Função de sucesso da edição
    const handleEditSuccess = (updatedResponsequestions: Response) => {
        setMessage('Resposta atualizada com sucesso!');
        setEditingResponsequestions(null); // Fecha a modal de edição
        loadData(); // Recarrega os dados para mostrar a alteração
    };

    // const handleDelete = async (responsequestions: Response) => {
    //     setMessage(null);
    //     if (window.confirm(`Tem certeza que deseja excluir o imóvel em "${responsequestions.cidade}"?`)) {
    //         setLoading(true);
    //         try {
    //             await deleteResponsequestions(responsequestions._id);
    //             await loadData();
    //             setMessage('Imóvel excluído com sucesso!');
    //         } catch (err) {
    //             setError('Falha ao excluir o imóvel.');
    //         } finally {
    //             setLoading(false);
    //         }
    //     }
    // };

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
                        Lista de Questões e Respostas
                    </Typography>
                    {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleOpenModalResponses}
                            color='primary'
                        >
                            Manipular Respostas
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleOpenModalQuestionnaires}
                            color='primary'
                        >
                            Manipular Questões
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<SyncIcon />}
                            onClick={handleAtualiza}
                            color="secondary" // Use uma cor diferente para destacar a ação de atualizar
                        >
                            Atualizar
                        </Button>
                    </Box>

                    {loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {!loading && !error && (
                        <ResponsequestionsTable
                            responsequestions={responsesArray}
                        // onEdit={handleEdit} 
                        // onDelete={handleDelete} 
                        />
                    )}

                    <Button onClick={onClose} sx={{ mt: 2 }}>
                        Fechar
                    </Button>
                </Box>
            </Modal>
            {/* <CreateResponsequestionsModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            /> */}
            {/* Modal de Edição */}
            {/* <EditResponsequestionsModal
                open={!!editingResponsequestions}
                responsequestions={editingResponsequestions}
                onClose={() => setEditingResponsequestions(null)}
                onSuccess={handleEditSuccess}
            /> */}
            <ResponsesModal
                open={isModalOpenResponses}
                onClose={handleCloseModalResponses}
            />
            <QuestionnairesModal
                open={isModalOpenQuestionnaires}
                onClose={handleCloseModalQuestionnaires}
            />
        </>
    );
};
