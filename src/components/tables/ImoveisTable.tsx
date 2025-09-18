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
import { Imovel } from '../../interfaces/Imovel';
import { scrollableTableContainer, tableCellSx, tableContainerSx, textFieldSx } from '../../styles/styles';

interface ImoveisTableProps {
    imoveis: Imovel[];
    onEdit: (imovel: Imovel) => void;
    onDelete: (imovel: Imovel) => void;
}

const highlightStyle = {
    backgroundColor: '#ADD8E6',
    color: 'black',
    fontWeight: 'bold',
};

const highlightText = (text: string | number, highlight: string) => {
    const textString = String(text);
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

export const ImoveisTable: React.FC<ImoveisTableProps> = ({ imoveis, onDelete, onEdit }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');

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
            const searchableText = `${imovel.tipo} ${imovel.rua} ${imovel.numero} ${imovel.cep} ${imovel.cidade} ${imovel.obs} ${imovel.copasa} ${imovel.cemig}`.toLowerCase();
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

    if (imoveis.length === 0) {
        return (
            <Typography variant="body1" align="center" sx={{ mt: 2, color: 'white' }}>
                Nenhum imóvel encontrado.
            </Typography>
        );
    }

    if (sortedAndFilteredImoveis.length === 0) {
        return (
            <>
                <Box sx={{ ...textFieldSx, mb: 2 }}>
                    <TextField
                        fullWidth
                        label="Pesquisar imóveis"
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        size="small"
                    />
                </Box>
                <Typography variant="body1" align="center" sx={{ mt: 2, color: 'white' }}>
                    Nenhum imóvel encontrado com o termo "{searchTerm}".
                </Typography>
            </>
        );
    }

    return (
        <Box>
            <Box sx={{ ...textFieldSx, mb: 2 }}>
                <TextField
                    fullWidth
                    label="Pesquisar imóveis"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    size="small"
                />
            </Box>
            <TableContainer component={Paper} sx={{ ...tableContainerSx, ...scrollableTableContainer }}>
                <Table stickyHeader aria-label="tabela de imóveis" size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ ...tableCellSx, py: 0.2, backgroundColor: '#1e1e1e' }}>Tipo</TableCell>
                            <TableCell sx={{ ...tableCellSx, py: 0.2, backgroundColor: '#1e1e1e' }}>Rua</TableCell>
                            <TableCell sx={{ ...tableCellSx, py: 0.2, backgroundColor: '#1e1e1e' }}>Número</TableCell>
                            <TableCell sx={{ ...tableCellSx, py: 0.2, backgroundColor: '#1e1e1e' }}>Complemento</TableCell>
                            <TableCell sx={{ ...tableCellSx, py: 0.2, backgroundColor: '#1e1e1e' }}>CEP</TableCell>
                            <TableCell sx={{ ...tableCellSx, py: 0.2, backgroundColor: '#1e1e1e' }}>Cidade</TableCell>
                            <TableCell sx={{ ...tableCellSx, py: 0.2, backgroundColor: '#1e1e1e' }}>UF</TableCell>
                            <TableCell sx={{ ...tableCellSx, py: 0.2, backgroundColor: '#1e1e1e' }}>Observação</TableCell>
                            <TableCell sx={{ ...tableCellSx, py: 0.2, backgroundColor: '#1e1e1e' }}>Copasa</TableCell>
                            <TableCell sx={{ ...tableCellSx, py: 0.2, backgroundColor: '#1e1e1e' }}>Cemig</TableCell>
                            <TableCell align="right" sx={{ ...tableCellSx, py: 0.2, backgroundColor: '#1e1e1e' }}>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedAndFilteredImoveis.map((imovel) => (
                            <TableRow key={imovel._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell sx={tableCellSx}>{highlightText(imovel.tipo, searchTerm)}</TableCell>
                                <TableCell sx={tableCellSx}>{highlightText(imovel.rua, searchTerm)}</TableCell>
                                <TableCell sx={tableCellSx}>{highlightText(imovel.numero, searchTerm)}</TableCell>
                                <TableCell sx={tableCellSx}>{imovel.complemento}</TableCell>
                                <TableCell sx={tableCellSx}>{highlightText(imovel.cep, searchTerm)}</TableCell>
                                <TableCell sx={tableCellSx}>{highlightText(imovel.cidade, searchTerm)}</TableCell>
                                <TableCell sx={tableCellSx}>{imovel.uf}</TableCell>
                                <TableCell sx={tableCellSx}>{highlightText(imovel.obs, searchTerm)}</TableCell>
                                <TableCell sx={tableCellSx}>{highlightText(imovel.copasa, searchTerm)}</TableCell>
                                <TableCell sx={tableCellSx}>{highlightText(imovel.cemig, searchTerm)}</TableCell>
                                <TableCell align="right" sx={tableCellSx}>
                                    <ButtonGroup variant="contained" aria-label="Ações de Imóvel">
                                        <Button
                                            color="primary"
                                            onClick={() => onEdit(imovel)}
                                            startIcon={<EditIcon />}
                                            sx={{ py: 0.2, px: 1, fontSize: '0.75rem' }}
                                        >
                                            Editar
                                        </Button>
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
        </Box>
    );
};