import * as React from 'react';
import {
    Modal,
    Box,
    Typography,
    CircularProgress,
    Button,
    Alert,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { Response } from '../../interfaces/response';
import { Questionnaire } from '../../interfaces/questionnaire';
import { deleteResponses, fetchResponses } from '../services/responseService';
import { ResponsesTable } from '../tables/ResponseTable';
import { CreateResponseModal } from '../Crud/CreateResponseModal';
import { fetchQuestionnaires } from '../services/QuestionnairesService';

// [NOVO] Importe a nova função de serviço para buscar por ID
import { fetchResponsesByQuestionId } from '../services/responseService';
import { EditResponseModal } from '../Crud/EditResponseModal';

interface responsesModalProps {
    open: boolean;
    onClose: () => void;
    questionDescription?: string;
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

export const ResponsesModal: React.FC<responsesModalProps> = ({ open, onClose, questionDescription }) => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [responses, setResponses] = React.useState<Response[]>([]);
    const [questions, setQuestions] = React.useState<Questionnaire[]>([]);
    const [responsesArray, setResponsesArray] = React.useState<any>([]);
    const [selectedQuestionId, setSelectedQuestionId] = React.useState<string>('');
    // [ADICIONADO] Novo estado para a descrição da pergunta
    const [selectedQuestionDescription, setSelectedQuestionDescription] = React.useState<string>('');
    const [error, setError] = React.useState<string | null>(null);
    const [message, setMessage] = React.useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
    const [editingResponse, setEditingResponse] = React.useState<Response | null>(null);

    const loadResponsesByQuestion = async (questionId: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchResponsesByQuestionId(questionId);
            const sortedResponses = [...data];
            // [CORRIGIDO] Alterado a propriedade de ordenação para a descrição da pergunta, que agora está disponível
            sortedResponses.sort((a, b) => a.id_question.question.localeCompare(b.id_question.question));
            setResponses(sortedResponses);
        } catch (err) {
            setError('Não foi possível carregar as respostas. Tente novamente.');
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
            loadDataQuestion();
        }
    }, [open]);

    React.useEffect(() => {
        if (open && selectedQuestionId) {
            loadResponsesByQuestion(selectedQuestionId);
        } else {
            setResponses([]);
        }
    }, [open, selectedQuestionId]);

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
        // [ADICIONADO] Verifica se uma pergunta foi selecionada antes de abrir a modal
        if (!selectedQuestionId) {
            setError('Selecione uma pergunta para criar uma resposta.');
            return;
        }
        setIsCreateModalOpen(true);
    };

    const handleCreateSuccess = (newResponse: Response) => {
        setMessage('Resposta criada com sucesso!');
        setIsCreateModalOpen(false);
        // [CORRIGIDO] Chama a função de recarga com o ID da pergunta selecionada
        loadResponsesByQuestion(selectedQuestionId);
    };

    const handleEdit = (response: Response) => {
        setEditingResponse(response);
    };

    const handleEditSuccess = (updatedresponse: Response) => {
        setMessage('Resposta atualizada com sucesso!');
        setEditingResponse(null);
        // [CORRIGIDO] Chama a função de recarga com o ID da pergunta selecionada
        loadResponsesByQuestion(selectedQuestionId);
    };

    const handleDelete = async (response: Response) => {
        setMessage(null);
        if (window.confirm(`Tem certeza que deseja excluir a resposta "${response.questionresponse}"?`)) {
            setLoading(true);
            try {
                await deleteResponses(response._id);
                // [CORRIGIDO] Chama a função de recarga com o ID da pergunta selecionada
                await loadResponsesByQuestion(selectedQuestionId);
                setMessage('Resposta excluído com sucesso!');
            } catch (err) {
                setError('Falha ao excluir a resposta.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleQuestionChange = (event: SelectChangeEvent<string>) => {
        const selectedId = event.target.value as string;
        setSelectedQuestionId(selectedId);

        // [CORRIGIDO] Encontre o objeto da pergunta no array `questions`
        const selectedQuestion = questions.find(q => q._id === selectedId);
        if (selectedQuestion) {
            // [CORRIGIDO] Atualiza o estado com a descrição da pergunta
            setSelectedQuestionDescription(selectedQuestion.question);
        } else {
            setSelectedQuestionDescription('');
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
                        Lista de Respostas
                    </Typography>
                    {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="question-select-label">Selecione uma Pergunta</InputLabel>
                            <Select
                                labelId="question-select-label"
                                value={selectedQuestionId}
                                label="Selecione uma Pergunta"
                                onChange={handleQuestionChange}
                            >
                                {questions.map((q) => (
                                    <MenuItem
                                        key={q._id}
                                        value={q._id}>
                                        {q.question}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleCreate}
                            sx={{ mb: 2 }}
                            disabled={!selectedQuestionId}
                        >
                            Criar Resposta
                        </Button>
                    </Box>

                    {loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {!loading && !error && (
                        // [CORRIGIDO] Passa o array de 'responses' (filtrado) para a tabela, não o `responsesArray`
                        <ResponsesTable
                            responses={responses}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}

                    <Button onClick={onClose} sx={{ mt: 2 }}>
                        Fechar
                    </Button>
                </Box>
            </Modal>

            <CreateResponseModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
                questionId={selectedQuestionId}
                // [CORRIGIDO] Passa o novo estado com a descrição da pergunta
                questionDescription={selectedQuestionDescription}
            />
            <EditResponseModal
                open={!!editingResponse}
                response={editingResponse}
                onClose={() => setEditingResponse(null)}
                onSuccess={handleEditSuccess}
            />
        </>
    );
};