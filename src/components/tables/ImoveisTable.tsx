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

interface ImoveisTableProps {
    imoveis: Imovel[];
    // Funções de callback para as ações
    onEdit: (imovel: Imovel) => void;
    onDelete: (imovel: Imovel) => void;
}

export const ImoveisTable: React.FC<ImoveisTableProps> = ({ imoveis, onDelete, onEdit }) => {
    if (imoveis.length === 0) {
        return (
            <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                Nenhum imóvel encontrado.
            </Typography>
        );
    }

    return (
        <TableContainer component={Paper}>
            <Table aria-label="tabela de imóveis" size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{py:0.2}}>Tipo</TableCell>
                        <TableCell sx={{py:0.2}}>Endereço</TableCell>
                        <TableCell sx={{py:0.2}}>Cidade</TableCell>
                        <TableCell sx={{py:0.2}}>UF</TableCell>
                        <TableCell sx={{py:0.2}}>Valor</TableCell>
                        <TableCell sx={{py:0.2}}>Descrição</TableCell>
                        <TableCell align="right" sx={{ py: 0.2 }}>Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {imoveis.map((imovel) => (
                        <TableRow key={imovel._id}>
                            <TableCell sx={{py:0.2}}>{imovel.tipo}</TableCell>
                            <TableCell sx={{py:0.2}}>{imovel.endereco}</TableCell>
                            <TableCell sx={{py:0.2}}>{imovel.cidade}</TableCell>
                            <TableCell sx={{py:0.2}}>{imovel.uf}</TableCell>
                            <TableCell sx={{py:0.2}}>{imovel.valor}</TableCell>
                            <TableCell sx={{py:0.2}}>{imovel.descricao}</TableCell>
                            <TableCell align="right" sx={{ py: 0.2 }}>
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