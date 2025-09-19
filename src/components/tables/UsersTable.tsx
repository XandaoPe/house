// src/components/UsersTable.tsx
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
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Ícone para ativar
import { User } from '../../interfaces/users';
import { scrollableTableContainer, tableCellSx, tableContainerSx, textFieldSx } from '../../styles/styles';

interface usersTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
    onDeactivate: (user: User) => void;
    // 🔥 NOVAS PROPS: para ativar e para saber o modo de exibição
    onActivate: (user: User) => void;
    showDisabledUsers: boolean;
}

const highlightStyle = {
    backgroundColor: '#ADD8E6',
    color: 'black',
    fontWeight: 'bold',
};

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

export const UsersTable: React.FC<usersTableProps> = ({ users, onDelete, onEdit, onDeactivate, onActivate, showDisabledUsers }) => {
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

    if (users.length === 0 && !showDisabledUsers) { // Apenas se não estiver mostrando desabilitados
        return (
            <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                Nenhum usuário ativo encontrado.
            </Typography>
        );
    }

    if (users.length === 0 && showDisabledUsers) { // Se estiver mostrando desabilitados e não houver nenhum
        return (
            <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                Nenhum usuário (ativo ou inativo) encontrado.
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
                        <TableRow
                            sx={{
                                ...tableCellSx,
                                py: 0.2,
                                backgroundColor: 'gray',
                                color: 'black',
                            }}>
                            <TableCell sx={{ ...tableCellSx, py: 0.2, backgroundColor: 'gray', color: 'black' }}>Nome</TableCell>
                            <TableCell sx={{ ...tableCellSx, py: 0.2, backgroundColor: 'gray', color: 'black' }}>Email</TableCell>
                            <TableCell sx={{ ...tableCellSx, py: 0.2, backgroundColor: 'gray', color: 'black' }}>Fone</TableCell>
                            <TableCell sx={{ ...tableCellSx, py: 0.2, backgroundColor: 'gray', color: 'black' }}>CPF</TableCell>
                            <TableCell sx={{ ...tableCellSx, py: 0.2, backgroundColor: 'gray', color: 'black' }}>Cargo</TableCell>
                            <TableCell align="right" sx={{ ...tableCellSx, py: 0.2, backgroundColor: 'gray', color: 'black' }}>Ações</TableCell>
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

                                        {/* 🔥 Lógica condicional para o botão Ativar/Desativar */}
                                        {user.isDisabled ? (
                                            <Button
                                                color="success" // Cor verde para ativar
                                                onClick={() => onActivate(user)}
                                                startIcon={<CheckCircleIcon />}
                                                sx={{ py: 0.2, px: 1, fontSize: '0.75rem' }}
                                            >
                                                Ativar
                                            </Button>
                                        ) : (
                                            <Button
                                                color="warning"
                                                onClick={() => onDeactivate(user)}
                                                startIcon={<BlockIcon />}
                                                sx={{ py: 0.2, px: 1, fontSize: '0.75rem' }}
                                                disabled={user.isDisabled} // Desativa o botão se o usuário já estiver inativo (caso não esteja no modo "Listar Todos")
                                            >
                                                Desativar
                                            </Button>
                                        )}

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