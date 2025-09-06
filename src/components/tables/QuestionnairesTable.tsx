import * as React from 'react';
import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Typography,
    ButtonGroup,
    Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Questionnaire } from '../../interfaces/questionnaire';
import EditNoteIcon from '@mui/icons-material/EditNote';
interface questionnairesTableProps {
    questionnaires: Questionnaire[];
    onEdit: (questionnaire: Questionnaire) => void;
    onDelete: (questionnaire: Questionnaire) => void;
    responseHandler: {
        setQuestionId: (id: string) => void;
        handleResponse: () => void;
    };
}


export const QuestionnairesTable: React.FC<questionnairesTableProps> = ({ questionnaires,  onDelete, onEdit, responseHandler}) => {
    const [question,setQuestion] = React.useState('')
    if (questionnaires.length === 0) {
        return (
            <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                Nenhum questionario encontrado.
            </Typography>
        );
    }

    return (
        <TableContainer component={Paper}>
            <Table aria-label="tabela de Questões" size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ py: 0.2 }}>Pergunta</TableCell>
                        <TableCell align="right" sx={{ py: 0.2 }}>Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {questionnaires.map((questionnaire) => (
                        <TableRow key={questionnaire._id}>
                            <TableCell sx={{ py: 0.2 }}>{questionnaire.question}</TableCell>
                            <TableCell align="right" sx={{ py: 0.2 }}>
                                <ButtonGroup variant="contained" aria-label="Ações de Questões">
                                    <Button
                                        color="primary"
                                        onClick={() => onEdit(questionnaire)}
                                        startIcon={<EditIcon />}
                                        sx={{ py: 0.2, px: 1, fontSize: '0.75rem' }}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        color="error"
                                        onClick={() => onDelete(questionnaire)}
                                        startIcon={<DeleteIcon />}
                                        sx={{ py: 0.2, px: 1, fontSize: '0.75rem' }}
                                    >
                                        Excluir
                                    </Button>
                                    <Button
                                        color='secondary'
                                        onClick={() =>{
                                            responseHandler.setQuestionId(questionnaire._id);
                                            responseHandler.handleResponse();
                                            setQuestion(questionnaire.question);
                                        }}
                                        startIcon={<EditNoteIcon />}
                                        sx={{ py: 0.2, px: 1, fontSize: '0.75rem' }}
                                    >
                                        Responder
                                    </Button>
                                </ButtonGroup>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};