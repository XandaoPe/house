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
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { User } from '../../interfaces/users';
import { scrollableTableContainer, tableCellSx, tableContainerSx, textFieldSx } from '../../styles/styles';
import { importUsersFromExcel, exportUsersToExcel } from '../services/UsersService';
import { toast } from 'react-toastify';

interface usersTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
    onDeactivate: (user: User) => void;
    onActivate: (user: User) => void;
    showDisabledUsers: boolean;
    onUsersReload: () => void;
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

export const UsersTable: React.FC<usersTableProps> = ({ users, onDelete, onEdit, onDeactivate, onActivate, showDisabledUsers, onUsersReload }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [highlightedColumns, setHighlightedColumns] = useState<string[]>([]);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [confirmDownloadOpen, setConfirmDownloadOpen] = useState(false);
    const [confirmExportOpen, setConfirmExportOpen] = useState(false);

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

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setConfirmModalOpen(true);
        }
    };

    const handleConfirmImport = async () => {
        if (selectedFile) {
            try {
                toast.info('Importando usuários... Aguarde.');
                const summary = await importUsersFromExcel(selectedFile);
                toast.success(`Importação concluída: ${summary.created} criados e ${summary.updated} atualizados.`);
                onUsersReload();
            } catch (error: any) {
                toast.error(error.message);
            } finally {
                setSelectedFile(null);
                setConfirmModalOpen(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        }
    };

    const handleCancelImport = () => {
        setConfirmModalOpen(false);
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleDownloadTemplate = () => {
        setConfirmDownloadOpen(true);
    };

    const handleConfirmDownload = () => {
        const link = document.createElement('a');
        link.href = '/template-usuarios.xlsx';
        link.setAttribute('download', 'template-usuarios.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setConfirmDownloadOpen(false);
    };

    const handleExport = () => {
        setConfirmExportOpen(true);
    };

    const handleExportUsers = async () => {
        try {
            toast.info('Exportando usuários... Aguarde.');
            await exportUsersToExcel();
            toast.success('Exportação concluída com sucesso!');
        } catch (error: any) {
            toast.error(error.message);
        }
        setConfirmExportOpen(false);
    };

    if (users.length === 0 && !showDisabledUsers) {
        return (
            <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                Nenhum usuário ativo encontrado.
            </Typography>
        );
    }

    if (users.length === 0 && showDisabledUsers) {
        return (
            <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                Nenhum usuário (ativo ou inativo) encontrado.
            </Typography>
        );
    }

    if (sortedAndFilteredUsers.length === 0) {
        return (
            <>
                <Box sx={{
                    display: 'flex',
                    gap: 1,
                    mb: 2,
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    ...textFieldSx,
                }}>
                    <TextField
                        sx={{ flexGrow: 1 }}
                        label="Pesquisar usuários"
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        size="small"
                    />
                    <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={handleDownloadTemplate}
                        sx={{ whiteSpace: 'nowrap' }}
                    >
                        Template
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                        onClick={handleImportClick}
                        sx={{ whiteSpace: 'nowrap' }}
                    >
                        Importar
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<SystemUpdateAltIcon />}
                        onClick={handleExport}
                        sx={{ whiteSpace: 'nowrap' }}
                    >
                        Exportar
                    </Button>
                </Box>
                <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                    Nenhum usuário encontrado com o termo "{searchTerm}".
                </Typography>
            </>
        );
    }

    return (
        <Box>
            <Box sx={{
                display: 'flex',
                gap: 1,
                mb: 2,
                alignItems: 'center',
                flexWrap: 'wrap',
                ...textFieldSx,
            }}>
                <TextField
                    sx={{ flexGrow: 1 }}
                    label="Pesquisar usuários"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    size="small"
                />
                <Tooltip
                    title="Fazer DownLoad do TEMPLATE com o cabeçalho correto, para inclusão/alteração dos dados de usuários."
                    placement="top" // Onde a dica de texto deve aparecer (pode ser 'right', 'bottom', etc.)
                >
                    <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={handleDownloadTemplate}
                        sx={{ whiteSpace: 'nowrap' }}
                    >
                        Template
                    </Button>
                </Tooltip>
                {/* 👈 Adicionando Tooltip para o botão Importar */}
                <Tooltip
                    title="Fazer UpLoad de uma planilha Excel com os dados dos usuários, seja atualização ou inclusão(usuário existente é verificado se há alteração de dados/usuário inexistente é automaticamente incluído)."
                    placement="top" // Onde a dica de texto deve aparecer (pode ser 'right', 'bottom', etc.)
                >
                    <Button
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                        onClick={handleImportClick}
                        sx={{ whiteSpace: 'nowrap' }}
                    >
                        Importar
                    </Button>
                </Tooltip>
                {/* 👈 Adicionando Tooltip para o botão Exportar */}
                <Tooltip
                    title="Fazer o DownLoad dos usuários cadastrados(todos, incluindo os inativos)."
                    placement="top"
                >
                    <Button
                        variant="contained"
                        startIcon={<SystemUpdateAltIcon />}
                        onClick={handleExport}
                        sx={{ whiteSpace: 'nowrap' }}
                    >
                        Exportar
                    </Button>
                </Tooltip>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".xlsx, .xls"
                    style={{ display: 'none' }}
                />
                {selectedFile && (
                    <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                        Arquivo selecionado: **{selectedFile.name}**
                    </Typography>
                )}
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
                            <TableCell
                                align="right"
                                sx={{
                                    ...tableCellSx,
                                    py: 0.2,
                                    backgroundColor: '#1e1e1e',
                                    position: 'sticky',
                                    right: 0,
                                    zIndex: 10
                                }}
                            >
                                Ações
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedAndFilteredUsers.map((user) => (
                            <TableRow
                                key={user._id}
                                sx={{
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    backgroundColor: user.isDisabled ? '#453422' : 'inherit'
                                }}
                            >
                                <TableCell sx={{ ...tableCellSx, py: 0.2 }}>{highlightText(user.name, searchTerm)}</TableCell>
                                <TableCell sx={{ ...tableCellSx, py: 0.2 }}>{highlightText(user.email, searchTerm)}</TableCell>
                                <TableCell sx={{ ...tableCellSx, py: 0.2 }}>{highlightText(user.phone, searchTerm)}</TableCell>
                                <TableCell sx={{ ...tableCellSx, py: 0.2 }}>{highlightText(user.cpf, searchTerm)}</TableCell>
                                <TableCell sx={{ ...tableCellSx, py: 0.2 }}>{highlightText(user.cargo, searchTerm)}</TableCell>
                                <TableCell
                                    align="right"
                                    sx={{
                                        ...tableCellSx,
                                        position: 'sticky',
                                        right: 0,
                                        zIndex: 1,
                                    }}
                                >
                                    <ButtonGroup variant="contained" aria-label="Ações de Usuário">
                                        <Button
                                            color="primary"
                                            onClick={() => onEdit(user)}
                                            startIcon={<EditIcon />}
                                            sx={{ py: 0.2, px: 1, fontSize: '0.75rem' }}
                                        >
                                            Editar
                                        </Button>
                                        {user.isDisabled ? (
                                            <Button
                                                color="success"
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
                                                disabled={user.isDisabled}
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

            <Dialog
                open={confirmModalOpen}
                onClose={handleCancelImport}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirmar Importação"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Você está prestes a importar o arquivo: **{selectedFile?.name}**.
                        Deseja continuar com a importação? Esta ação pode criar novos usuários ou atualizar os existentes.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelImport} color="error">
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmImport} color="primary" autoFocus>
                        Confirmar Importação
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={confirmDownloadOpen}
                onClose={() => setConfirmDownloadOpen(false)}
                aria-labelledby="download-dialog-title"
                aria-describedby="download-dialog-description"
            >
                <DialogTitle id="download-dialog-title">
                    {"Confirmar Download do Template"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="download-dialog-description">
                        Deseja baixar o arquivo de template? Ele contém o cabeçalho correto para a inclusão ou alteração de usuários.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDownloadOpen(false)} color="error">
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmDownload} color="primary" autoFocus>
                        Confirmar Download
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={confirmExportOpen}
                onClose={() => setConfirmExportOpen(false)}
                aria-labelledby="download-dialog-title"
                aria-describedby="download-dialog-description"
            >
                <DialogTitle id="download-dialog-title">
                    {"Confirmar Download dos usuários em excel "}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="download-dialog-description">
                        Deseja fazer o download dos usuários cadastrados (todos, incluindo os inativos)?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmExportOpen(false)} color="error">
                        Cancelar
                    </Button>
                    <Button onClick={handleExportUsers} color="primary" autoFocus>
                        Confirmar Download
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};