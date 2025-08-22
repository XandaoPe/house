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
import { Collaborator } from '../../interfaces/collaborators';

interface collaboratorsTableProps {
    collaborators: Collaborator[];
    onEdit: (collaborator: Collaborator) => void;
    onDelete: (collaborator: Collaborator) => void;
}

export const CollaboratorsTable: React.FC<collaboratorsTableProps> = ({ collaborators, onDelete, onEdit }) => {
    if (collaborators.length === 0) {
        return (
            <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                Nenhum colaborador encontrado.
            </Typography>
        );
    }

    return (
        <TableContainer component={Paper}>
            <Table aria-label="tabela de imóveis">
                <TableHead>
                    <TableRow>
                        <TableCell>Nome</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Fone</TableCell>
                        <TableCell align="right">Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {collaborators.map((collaborator) => (
                        <TableRow key={collaborator._id}>
                            <TableCell>{collaborator.name}</TableCell>
                            <TableCell>{collaborator.email}</TableCell>
                            <TableCell>{collaborator.phone}</TableCell>
                            <TableCell align="right">
                                <ButtonGroup variant="contained" aria-label="Ações de Imóvel">
                                    <Button
                                        color="primary"
                                        onClick={() => onEdit(collaborator)}
                                        startIcon={<EditIcon />}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        color="error"
                                        onClick={() => onDelete(collaborator)}
                                        startIcon={<DeleteIcon />}
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