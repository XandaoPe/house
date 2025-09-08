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
    Link,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Response } from '../../interfaces/response';
import { QuestionnairesModal } from '../Modal/QuestionnaireModal';
import { scrollableTableContainer, tableCellSx, tableContainerSx } from '../../styles/styles';

interface ResponsequestionsTableProps {
    responsequestions: {
        question: string;
        response: { id_response: number; response: string }[];
    }[];
    onEdit?: (responsequestions: Response) => void;
    onDelete?: (responsequestions: Response) => void;
}

export const ResponsequestionsTable: React.FC<ResponsequestionsTableProps> = ({ responsequestions, onEdit, onDelete }) => {

    if (!responsequestions || responsequestions.length === 0) {
        return (
            <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                Nenhuma resposta encontrada.
            </Typography>
        );
    }

    return (
        <TableContainer component={Paper} sx={{ ...tableContainerSx, ...scrollableTableContainer }}>
            <Table stickyHeader aria-label="tabela de Questões e Respostas" size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ ...tableCellSx, py: 0.2, backgroundColor: '#1e1e1e' }}>Questão</TableCell>
                        <TableCell sx={{ ...tableCellSx, py: 0.2, backgroundColor: '#1e1e1e' }}>Respostas</TableCell>
                        {/* <TableCell align="right" sx={{ ...tableCellSx, py: 0.2 }}>Ações</TableCell> */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {responsequestions.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell sx={{ ...tableCellSx, py: 0.2 }}>{item.question}</TableCell>
                            <TableCell sx={{ ...tableCellSx, py: 0.2 }}>
                                <ul>
                                    {item.response.map(res => (
                                        <li key={res.id_response}>
                                            {res.response}
                                        </li>
                                    ))}
                                </ul>
                            </TableCell>
                            {/* 
                            <TableCell align="right" sx={{ py: 0.2 }}>
                                <ButtonGroup variant="contained" aria-label="Ações">
                                    <Button
                                        color="primary"
                                        onClick={() => onEdit(item)}
                                        startIcon={<EditIcon />}
                                        sx={{ py: 0.2, px: 1, fontSize: '0.75rem' }}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        color="error"
                                        onClick={() => onDelete(item)}
                                        startIcon={<DeleteIcon />}
                                        sx={{ py: 0.2, px: 1, fontSize: '0.75rem' }}
                                    >
                                        Excluir
                                    </Button>
                                </ButtonGroup>
                            </TableCell> */}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};