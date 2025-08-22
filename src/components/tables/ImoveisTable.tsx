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
            <Table aria-label="tabela de imóveis">
                <TableHead>
                    <TableRow>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Endereço</TableCell>
                        <TableCell>Cidade</TableCell>
                        <TableCell>UF</TableCell>
                        <TableCell>Valor</TableCell>
                        <TableCell>Descrição</TableCell>
                        <TableCell align="right">Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {imoveis.map((imovel) => (
                        <TableRow key={imovel._id}>
                            <TableCell>{imovel.tipo}</TableCell>
                            <TableCell>{imovel.endereco}</TableCell>
                            <TableCell>{imovel.cidade}</TableCell>
                            <TableCell>{imovel.uf}</TableCell>
                            <TableCell>{imovel.valor}</TableCell>
                            <TableCell>{imovel.descricao}</TableCell>
                            <TableCell align="right">
                                <ButtonGroup variant="contained" aria-label="Ações de Imóvel">
                                    <Button
                                        color="primary"
                                        onClick={() => onEdit(imovel)}
                                        startIcon={<EditIcon />}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        color="error"
                                        onClick={() => onDelete(imovel)}
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