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
import { User } from '../../interfaces/users';
import { tableCellSx, tableContainerSx } from '../../styles/styles';

interface usersTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
}

export const UsersTable: React.FC<usersTableProps> = ({ users, onDelete, onEdit }) => {
    if (users.length === 0) {
        return (
            <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                Nenhum colaborador encontrado.
            </Typography>
        );
    }

    return (
        <TableContainer component={Paper} sx={tableContainerSx}>
            <Table aria-label="tabela de Usuários" size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ ...tableCellSx, py: 0.2 }}>Nome</TableCell>
                        <TableCell sx={{ ...tableCellSx, py: 0.2 }}>Email</TableCell>
                        <TableCell sx={{ ...tableCellSx, py: 0.2 }}>Fone</TableCell>
                        <TableCell sx={{ ...tableCellSx, py: 0.2 }}>CPF</TableCell>
                        <TableCell sx={{ ...tableCellSx, py: 0.2 }}>Cargo</TableCell>
                        <TableCell align="right" sx={{ ...tableCellSx, py: 0.2 }}>Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user._id}>
                            <TableCell sx={{ ...tableCellSx, py: 0.2 }}>{user.name}</TableCell>
                            <TableCell sx={{ ...tableCellSx, py: 0.2 }}>{user.email}</TableCell>
                            <TableCell sx={{ ...tableCellSx, py: 0.2 }}>{user.phone}</TableCell>
                            <TableCell sx={{ ...tableCellSx, py: 0.2 }}>{user.cpf}</TableCell>
                            <TableCell sx={{ ...tableCellSx, py: 0.2 }}>{user.cargo}</TableCell>
                            <TableCell align="right" sx={{ ...tableCellSx, py: 0.2 }}>
                                <ButtonGroup variant="contained" aria-label="Ações de Imóvel">
                                    <Button
                                        color="primary"
                                        onClick={() => onEdit(user)}
                                        startIcon={<EditIcon />}
                                        sx={{ py: 0.2, px: 1, fontSize: '0.75rem' }}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        color="error"
                                        onClick={() => onDelete(user)}
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