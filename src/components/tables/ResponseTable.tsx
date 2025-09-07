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
import { Response } from '../../interfaces/response';
import { tableCellSx, tableContainerSx } from '../../styles/styles';

interface responsesTableProps {
    responses: Response[];
    onEdit: (response: Response) => void;
    onDelete: (response: Response) => void;
}

export const ResponsesTable: React.FC<responsesTableProps> = ({ responses, onDelete, onEdit }) => {
    if (responses.length === 0) {
        return (
            <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                Nenhuma pergunta selecionada.
            </Typography>
        );
    }

    return (
        <TableContainer component={Paper} sx={tableContainerSx}>
            <Table aria-label="tabela de respostas" size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ ...tableCellSx, py: 0.2 }}>Pergunta</TableCell>
                        <TableCell sx={{ ...tableCellSx, py: 0.2 }}>Resposta</TableCell>
                        <TableCell align="right" sx={{ ...tableCellSx, py: 0.2 }}>Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {responses.map((response) => (
                        <TableRow key={response._id}>
                            <TableCell sx={{ ...tableCellSx, py: 0.2 }}>{response.id_question.question}</TableCell>
                            <TableCell sx={{ ...tableCellSx, py: 0.2 }}>{response.questionresponse}</TableCell>
                            <TableCell align="right" sx={{ ...tableCellSx, py: 0.2 }}>
                                <ButtonGroup variant="contained" aria-label="Ações de Imóvel">
                                    <Button
                                        color="primary"
                                        onClick={() => onEdit(response)}
                                        startIcon={<EditIcon />}
                                        sx={{ py: 0.2, px: 1, fontSize: '0.75rem' }}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        color="error"
                                        onClick={() => onDelete(response)}
                                        startIcon={<DeleteIcon />}
                                        sx={{ py: 0.2, px: 1, fontSize: '0.75rem' }}
                                    >
                                        Excluir
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