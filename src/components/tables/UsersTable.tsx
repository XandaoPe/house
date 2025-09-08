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

// Estilo para o texto destacado
const highlightStyle = {
    backgroundColor: 'beige',
    color: 'black',
    fontWeight: 'bold',
};

// Função auxiliar para destacar o texto
const highlightText = (text: string, highlight: string) => {
    if (!highlight) {
        return text;
    }
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
        <span>
            {parts.map((part, i) =>
                part.toLowerCase() === highlight.toLowerCase() ? (
                    <span key={i} style={highlightStyle}>
                        {part}
                    </span>
                ) : (
                    part
                )
            )}
        </span>
    );
};

export const UsersTable: React.FC<usersTableProps> = ({ users, onDelete, onEdit }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [highlightedColumns, setHighlightedColumns] = useState<string[]>([]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const sortedAndFilteredUsers = useMemo(() => {
        let sortedUsers = [...users];
        sortedUsers.sort((a, b) => a.name.localeCompare(b.name));

        if (!searchTerm) {
            setHighlightedColumns([]);
            return sortedUsers;
        }

        const lowercasedSearchTerm = searchTerm.toLowerCase();

        const matchedColumns: string[] = [];
        if (users.some(user => user.name.toLowerCase().includes(lowercasedSearchTerm))) {
            matchedColumns.push('name');
        }
        if (users.some(user => user.email.toLowerCase().includes(lowercasedSearchTerm))) {
            matchedColumns.push('email');
        }
        if (users.some(user => user.phone.toLowerCase().includes(lowercasedSearchTerm))) {
            matchedColumns.push('phone');
        }
        if (users.some(user => user.cpf.toLowerCase().includes(lowercasedSearchTerm))) {
            matchedColumns.push('cpf');
        }
        if (users.some(user => user.cargo.toLowerCase().includes(lowercasedSearchTerm))) {
            matchedColumns.push('cargo');
        }
        setHighlightedColumns(matchedColumns);

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
                            <TableCell
                                sx={{
                                    ...tableCellSx,
                                    py: 0.2,
                                    backgroundColor: highlightedColumns.includes('name') ? 'beige' : '#1e1e1e',
                                    color: highlightedColumns.includes('name') ? 'black' : 'white',
                                }}>
                                Nome
                            </TableCell>
                            <TableCell
                                sx={{
                                    ...tableCellSx,
                                    py: 0.2,
                                    backgroundColor: highlightedColumns.includes('email') ? 'beige' : '#1e1e1e',
                                    color: highlightedColumns.includes('email') ? 'black' : 'white',
                                }}>
                                Email
                            </TableCell>
                            <TableCell
                                sx={{
                                    ...tableCellSx,
                                    py: 0.2,
                                    backgroundColor: highlightedColumns.includes('phone') ? 'beige' : '#1e1e1e',
                                    color: highlightedColumns.includes('phone') ? 'black' : 'white',
                                }}>
                                Fone
                            </TableCell>
                            <TableCell
                                sx={{
                                    ...tableCellSx,
                                    py: 0.2,
                                    backgroundColor: highlightedColumns.includes('cpf') ? 'beige' : '#1e1e1e',
                                    color: highlightedColumns.includes('cpf') ? 'black' : 'white',
                                }}>
                                CPF
                            </TableCell>
                            <TableCell
                                sx={{
                                    ...tableCellSx,
                                    py: 0.2,
                                    backgroundColor: highlightedColumns.includes('cargo') ? 'beige' : '#1e1e1e',
                                    color: highlightedColumns.includes('cargo') ? 'black' : 'white',
                                }}>
                                Cargo
                            </TableCell>
                            <TableCell align="right" sx={{ ...tableCellSx, py: 0.2, backgroundColor: '#1e1e1e' }}>
                                Ações
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedAndFilteredUsers.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell sx={{ ...tableCellSx, py: 0.2 }}>{highlightText(user.name, searchTerm)}</TableCell>
                                <TableCell sx={{ ...tableCellSx, py: 0.2 }}>{highlightText(user.email, searchTerm)}</TableCell>
                                <TableCell sx={{ ...tableCellSx, py: 0.2 }}>{highlightText(user.phone, searchTerm)}</TableCell>
                                <TableCell sx={{ ...tableCellSx, py: 0.2 }}>{highlightText(user.cpf, searchTerm)}</TableCell>
                                <TableCell sx={{ ...tableCellSx, py: 0.2 }}>{highlightText(user.cargo, searchTerm)}</TableCell>
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