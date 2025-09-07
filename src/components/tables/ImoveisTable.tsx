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
import { Imovel } from '../../interfaces/Imovel';
import { tableCellSx, tableContainerSx } from '../../styles/styles';

interface ImoveisTableProps {
    imoveis: Imovel[];
    // Funções de callback para as ações
    onEdit: (imovel: Imovel) => void;
    onDelete: (imovel: Imovel) => void;
}

export const ImoveisTable: React.FC<ImoveisTableProps> = ({ imoveis, onDelete, onEdit }) => {
    if (imoveis.length === 0) {
        return (
            <Typography variant="body1" align="center" sx={{ mt: 2, color: 'white' }}>
                Nenhum imóvel encontrado.
            </Typography>
        );
    }

    return (
        <TableContainer component={Paper} sx={tableContainerSx}>
            <Table aria-label="tabela de imóveis" size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={tableCellSx}>Tipo</TableCell>
                        <TableCell sx={tableCellSx}>Endereço</TableCell>
                        <TableCell sx={tableCellSx}>Cidade</TableCell>
                        <TableCell sx={tableCellSx}>UF</TableCell>
                        <TableCell sx={tableCellSx}>Valor</TableCell>
                        <TableCell sx={tableCellSx}>Descrição</TableCell>
                        <TableCell align="right" sx={tableCellSx}>Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {imoveis.map((imovel) => (
                        <TableRow key={imovel._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell sx={tableCellSx}>{imovel.tipo}</TableCell>
                            <TableCell sx={tableCellSx}>{imovel.endereco}</TableCell>
                            <TableCell sx={tableCellSx}>{imovel.cidade}</TableCell>
                            <TableCell sx={tableCellSx}>{imovel.uf}</TableCell>
                            <TableCell sx={tableCellSx}>{imovel.valor}</TableCell>
                            <TableCell sx={tableCellSx}>{imovel.descricao}</TableCell>
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
    );
};