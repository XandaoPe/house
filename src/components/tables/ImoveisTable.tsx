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
import { Imovel } from '../../interfaces/Imovel';
import { scrollableTableContainer, tableCellSx, tableContainerSx, textFieldSx } from '../../styles/styles';
import { toast } from 'react-toastify';
// Importação dos serviços de imóveis (serão criados ou adaptados abaixo)
import { importImobsFromExcel, exportImobsToExcel } from '../services/imovesService'; // Assumindo que este caminho existe ou será criado

interface ImoveisTableProps {
    imoveis: Imovel[];
    onEdit: (imovel: Imovel) => void;
    onDelete: (imovel: Imovel) => void;
    onDeactivate: (imovel: Imovel) => void;
    onActivate: (imovel: Imovel) => void;
    showDisabledImoveis: boolean;
    onImobsReload: () => void; // Adicionado para recarregar imóveis após importação
}

const highlightStyle = {
    backgroundColor: '#ADD8E6',
    color: 'black',
    fontWeight: 'bold',
};

const highlightText = (text: string | number | undefined | null, highlight: string) => {
    const textString = String(text || ''); // Garante que text é uma string vazia se for null/undefined
    if (!highlight) {
        return textString;
    }
    const parts = textString.split(new RegExp(`(${highlight})`, 'gi'));
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

export const ImoveisTable: React.FC<ImoveisTableProps> = ({ imoveis, onDelete, onEdit, onDeactivate, onActivate, showDisabledImoveis, onImobsReload }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [confirmDownloadOpen, setConfirmDownloadOpen] = useState(false);
    const [confirmExportOpen, setConfirmExportOpen] = useState(false);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const sortedAndFilteredImoveis = useMemo(() => {
        let sortedImoveis = [...imoveis];
        sortedImoveis.sort((a, b) => (a.rua || '').localeCompare(b.rua || ''));

        if (!searchTerm) {
            return sortedImoveis;
        }

        const lowercasedSearchTerm = searchTerm.toLowerCase();

        return sortedImoveis.filter(imovel => {
            const searchableText = `${imovel.tipo || ''} ${imovel.rua || ''} ${imovel.numero || ''} ${imovel.cep || ''} ${imovel.cidade || ''} ${imovel.uf || ''} ${imovel.obs || ''} ${imovel.copasa || ''} ${imovel.cemig || ''}`.toLowerCase();
            return searchableText.includes(lowercasedSearchTerm);
        });
    }, [imoveis, searchTerm]);

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        if (sortedAndFilteredImoveis.length === 0 && searchTerm) {
            timer = setTimeout(() => {
                setSearchTerm('');
            }, 3000);
        }

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [sortedAndFilteredImoveis, searchTerm]);

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
                toast.info('Importando imóveis... Aguarde.');
                const summary = await importImobsFromExcel(selectedFile);
                toast.success(`Importação concluída: ${summary.created} criados, ${summary.updated} atualizados e ${summary.disabled} desativados.`);
                onImobsReload();
            } catch (error: any) {
                toast.error(error.message || 'Erro ao importar imóveis.');
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
        link.href = '/template-imoveis.xlsx'; // Certifique-se de que este arquivo existe no diretório public
        link.setAttribute('download', 'template-imoveis.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setConfirmDownloadOpen(false);
    };

    const handleExport = () => {
        setConfirmExportOpen(true);
    };

    const handleExportImobs = async () => {
        try {
            toast.info('Exportando imóveis... Aguarde.');
            await exportImobsToExcel();
            toast.success('Exportação concluída com sucesso!');
        } catch (error: any) {
            toast.error(error.message || 'Erro ao exportar imóveis.');
        }
        setConfirmExportOpen(false);
    };

    if (imoveis.length === 0 && !showDisabledImoveis) {
        return (
            <Typography variant="body1" align="center" sx={{ mt: 2, color: 'white' }}>
                Nenhum imóvel ativo encontrado.
            </Typography>
        );
    }

    if (imoveis.length === 0 && showDisabledImoveis) {
        return (
            <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                Nenhum imóvel (ativo ou inativo) encontrado.
            </Typography>
        );
    }

    if (sortedAndFilteredImoveis.length === 0) {
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
                        label="Pesquisar imóveis"
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
                <Typography variant="body1" align="center" sx={{ mt: 2, color: 'white' }}>
                    Nenhum imóvel encontrado com o termo "{searchTerm}".
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
                    label="Pesquisar imóveis"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    size="small"
                />
                <Tooltip
                    title="Fazer Download do TEMPLATE com o cabeçalho correto para inclusão/alteração de imóveis."
                    placement="top"
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
                <Tooltip
                    title="Fazer Upload de uma planilha Excel com os dados dos imóveis, seja atualização ou inclusão (imóvel existente é verificado se há alteração de dados / imóvel inexistente é automaticamente incluído)."
                    placement="top"
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
                <Tooltip
                    title="Fazer o Download dos imóveis cadastrados (todos, incluindo os inativos)."
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
                <Table stickyHeader aria-label="tabela de imóveis" size="small">
                    <TableHead>
                        <TableRow
                            sx={{
                                ...tableCellSx,
                                py: 0.2,
                                backgroundColor: 'gray',
                                color: 'black',
                            }}>
                            <TableCell sx={{ ...tableCellSx, py: 0.2, backgroundColor: 'gray', color: 'black' }}>Tipo</TableCell>
                            <TableCell sx={{ ...tableCellSx, py: 0.2, backgroundColor: 'gray', color: 'black' }}>Rua</TableCell>
                            <TableCell sx={{ ...tableCellSx, py: 0.2, backgroundColor: 'gray', color: 'black' }}>Número</TableCell>
                            <TableCell sx={{ ...tableCellSx, py: 0.2, backgroundColor: 'gray', color: 'black' }}>Complemento</TableCell>
                            <TableCell sx={{ ...tableCellSx, py: 0.2, backgroundColor: 'gray', color: 'black' }}>CEP</TableCell>
                            <TableCell sx={{ ...tableCellSx, py: 0.2, backgroundColor: 'gray', color: 'black' }}>Cidade</TableCell>
                            <TableCell sx={{ ...tableCellSx, py: 0.2, backgroundColor: 'gray', color: 'black' }}>UF</TableCell>
                            <TableCell sx={{ ...tableCellSx, py: 0.2, backgroundColor: 'gray', color: 'black' }}>Observação</TableCell>
                            <TableCell sx={{ ...tableCellSx, py: 0.2, backgroundColor: 'gray', color: 'black' }}>Copasa</TableCell>
                            <TableCell sx={{ ...tableCellSx, py: 0.2, backgroundColor: 'gray', color: 'black' }}>Cemig</TableCell>
                            <TableCell sx={{ ...tableCellSx, py: 0.2, backgroundColor: 'gray', color: 'black' }}>Status</TableCell> {/* Novo: Coluna de status */}
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
                        {sortedAndFilteredImoveis.map((imovel) => (
                            <TableRow
                                key={imovel._id}
                                sx={{
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    backgroundColor: imovel.isDisabled ? '#453422' : 'inherit'
                                }}
                            >
                                <TableCell sx={{ ...tableCellSx, py: 0.2 }}>{highlightText(imovel.tipo, searchTerm)}</TableCell>
                                <TableCell sx={{ ...tableCellSx, py: 0.2 }}>{highlightText(imovel.rua, searchTerm)}</TableCell>
                                <TableCell sx={{ ...tableCellSx, py: 0.2 }}>{highlightText(imovel.numero, searchTerm)}</TableCell>
                                <TableCell sx={{ ...tableCellSx, py: 0.2 }}>{highlightText(imovel.complemento, searchTerm)}</TableCell>
                                <TableCell sx={{ ...tableCellSx, py: 0.2 }}>{highlightText(imovel.cep, searchTerm)}</TableCell>
                                <TableCell sx={{ ...tableCellSx, py: 0.2 }}>{highlightText(imovel.cidade, searchTerm)}</TableCell>
                                <TableCell sx={{ ...tableCellSx, py: 0.2 }}>{highlightText(imovel.uf, searchTerm)}</TableCell>
                                <TableCell sx={{ ...tableCellSx, py: 0.2 }}>{highlightText(imovel.obs, searchTerm)}</TableCell>
                                <TableCell sx={{ ...tableCellSx, py: 0.2 }}>{highlightText(imovel.copasa, searchTerm)}</TableCell>
                                <TableCell sx={{ ...tableCellSx, py: 0.2 }}>{highlightText(imovel.cemig, searchTerm)}</TableCell>
                                {/* Novo: Célula de status */}
                                <TableCell
                                    sx={{
                                        ...tableCellSx,
                                        py: 0.2,
                                        backgroundColor: imovel.isDisabled ? '#453422' : 'inherit'
                                    }}
                                >
                                    {imovel.isDisabled ? 'Inativo' : 'Ativo'}
                                </TableCell>
                                <TableCell
                                    align="right"
                                    sx={{
                                        ...tableCellSx,
                                        position: 'sticky',
                                        right: 0,
                                        zIndex: 1,
                                        backgroundColor: imovel.isDisabled ? '#453422' : '#222222',
                                    }}
                                >
                                    <ButtonGroup variant="contained" aria-label="Ações de Imóvel">
                                        <Button
                                            color="primary"
                                            onClick={() => onEdit(imovel)}
                                            startIcon={<EditIcon />}
                                            sx={{ py: 0.2, px: 1, fontSize: '0.75rem' }}
                                        >
                                            Editar
                                        </Button>
                                        {imovel.isDisabled ? (
                                            <Button
                                                color="success"
                                                onClick={() => onActivate(imovel)}
                                                startIcon={<CheckCircleIcon />}
                                                sx={{ py: 0.2, px: 1, fontSize: '0.75rem' }}
                                            >
                                                Ativar
                                            </Button>
                                        ) : (
                                            <Button
                                                color="warning"
                                                onClick={() => onDeactivate(imovel)}
                                                startIcon={<BlockIcon />}
                                                sx={{ py: 0.2, px: 1, fontSize: '0.75rem' }}
                                            >
                                                Desativar
                                            </Button>
                                        )}
                                        <Button
                                            color="error"
                                            onClick={() => onDelete(imovel)}
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

            {/* Modal de Confirmação de Importação */}
            <Dialog
                open={confirmModalOpen}
                onClose={handleCancelImport}
                aria-labelledby="imob-import-dialog-title"
                aria-describedby="imob-import-dialog-description"
            >
                <DialogTitle id="imob-import-dialog-title">
                    {"Confirmar Importação de Imóveis"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="imob-import-dialog-description">
                        Você está prestes a importar o arquivo: **{selectedFile?.name}**.
                        Deseja continuar com a importação? Esta ação pode criar novos imóveis, atualizar os existentes ou desativar imóveis conforme o arquivo.
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

            {/* Modal de Confirmação de Download do Template */}
            <Dialog
                open={confirmDownloadOpen}
                onClose={() => setConfirmDownloadOpen(false)}
                aria-labelledby="imob-download-template-dialog-title"
                aria-describedby="imob-download-template-dialog-description"
            >
                <DialogTitle id="imob-download-template-dialog-title">
                    {"Confirmar Download do Template de Imóveis"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="imob-download-template-dialog-description">
                        Deseja baixar o arquivo de template para imóveis? Ele contém o cabeçalho correto para a inclusão ou alteração de dados de imóveis.
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

            {/* Modal de Confirmação de Exportação */}
            <Dialog
                open={confirmExportOpen}
                onClose={() => setConfirmExportOpen(false)}
                aria-labelledby="imob-export-dialog-title"
                aria-describedby="imob-export-dialog-description"
            >
                <DialogTitle id="imob-export-dialog-title">
                    {"Confirmar Download dos imóveis em Excel"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="imob-export-dialog-description">
                        Deseja fazer o download dos imóveis cadastrados (todos, incluindo os inativos)?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmExportOpen(false)} color="error">
                        Cancelar
                    </Button>
                    <Button onClick={handleExportImobs} color="primary" autoFocus>
                        Confirmar Download
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};