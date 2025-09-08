import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
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
    TextField,
    Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { User } from '../../interfaces/users';
import { scrollableTableContainer, tableCellSx, tableContainerSx, textFieldSx } from '../../styles/styles';

interface usersTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
}

export const UsersTable: React.FC<usersTableProps> = ({ users, onDelete, onEdit }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const sortedAndFilteredUsers = useMemo(() => {
        // Primeiro, cria uma cópia do array de usuários para não modificar o original
        let sortedUsers = [...users];

        // Ordena a lista de usuários por nome
        sortedUsers.sort((a, b) => a.name.localeCompare(b.name));

        // Em seguida, aplica o filtro, se houver um termo de pesquisa
        if (!searchTerm) {
            return sortedUsers;
        }

        const lowercasedSearchTerm = searchTerm.toLowerCase();

        return sortedUsers.filter(user => {
            const searchableText = `${user.name} ${user.email} ${user.phone} ${user.cpf} ${user.cargo}`.toLowerCase();
            return searchableText.includes(lowercasedSearchTerm);
        });
    }, [users, searchTerm]);

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        if (sortedAndFilteredUsers.length === 0 && searchTerm) {
            timer = setTimeout(() => {
                setSearchTerm('');
            }, 3000);
        }

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [sortedAndFilteredUsers, searchTerm]);

    if (users.length === 0) {
        return (
            <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                Nenhum usuário encontrado.
            </Typography>
        );
    }

    if (sortedAndFilteredUsers.length === 0) {
        return (
            <>
                <Box sx={{ ...textFieldSx, mb: 2 }}>
                    <TextField
                        fullWidth
                        label="Pesquisar usuários"
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        size="small"
                    />
                </Box>
                <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                    Nenhum usuário encontrado com o termo "{searchTerm}".
                </Typography>
            </>
        );
    }

    return (
        <Box>
            <Box sx={{ ...textFieldSx, mb: 2 }}>
                <TextField
                    fullWidth
                    label="Pesquisar usuários"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    size="small"
                />
            </Box>
            <TableContainer component={Paper} sx={{ ...tableContainerSx, ...scrollableTableContainer }}>
                <Table stickyHeader aria-label="tabela de Usuários" size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ ...tableCellSx, py: 0.2, backgroundColor: '#1e1e1e' }}>Nome</TableCell>
                            <TableCell sx={{ ...tableCellSx, py: 0.2, backgroundColor: '#1e1e1e' }}>Email</TableCell>
                            <TableCell sx={{ ...tableCellSx, py: 0.2, backgroundColor: '#1e1e1e' }}>Fone</TableCell>
                            <TableCell sx={{ ...tableCellSx, py: 0.2, backgroundColor: '#1e1e1e' }}>CPF</TableCell>
                            <TableCell sx={{ ...tableCellSx, py: 0.2, backgroundColor: '#1e1e1e' }}>Cargo</TableCell>
                            <TableCell align="right" sx={{ ...tableCellSx, py: 0.2, backgroundColor: '#1e1e1e' }}>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedAndFilteredUsers.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell sx={{ ...tableCellSx, py: 0.2 }}>{user.name}</TableCell>
                                <TableCell sx={{ ...tableCellSx, py: 0.2 }}>{user.email}</TableCell>
                                <TableCell sx={{ ...tableCellSx, py: 0.2 }}>{user.phone}</TableCell>
                                <TableCell sx={{ ...tableCellSx, py: 0.2 }}>{user.cpf}</TableCell>
                                <TableCell sx={{ ...tableCellSx, py: 0.2 }}>{user.cargo}</TableCell>
                                <TableCell align="right" sx={{ ...tableCellSx, py: 0.2 }}>
                                    <ButtonGroup variant="contained" aria-label="Ações de Usuário">
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
        </Box>
    );
};