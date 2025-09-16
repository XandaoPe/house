import * as React from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
} from '@mui/material';
import { createImovel } from '../services/imovesService';
import { Imovel } from '../../interfaces/Imovel';
import { styleModal, textFieldSx } from '../../styles/styles';

interface CreateImovelModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (imovel: Imovel) => void;
}

const modalStyle = {
    ...styleModal,
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: 350, sm: 600, md: 900, lg: 1200 },
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
};

export const CreateImovelModal: React.FC<CreateImovelModalProps> = ({ open, onClose, onSuccess }) => {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [formData, setFormData] = React.useState({
        thumb: '',
        tipo: '',
        endereco: '',
        cidade: '',
        uf: '',
        valor: '',
        descricao: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const newImovel = await createImovel(formData);
            onSuccess(newImovel); // Chama a função de sucesso do componente pai
            onClose(); // Fecha a modal
        } catch (err) {
            setError('Falha ao criar o imóvel. Verifique os dados e tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle} component="form" onSubmit={handleSubmit}>
                <Typography variant="h6" component="h2">
                    Criar Novo Imóvel
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <Box sx={{ ...textFieldSx, mb: 2, gap: 1, display: 'flex', flexDirection: 'column' }} >
                    <TextField
                        label="Thumb"
                        name="thumb"
                        value={formData.thumb}
                        onChange={handleChange}
                        required
                        size="small"
                    />
                    <TextField
                        label="Tipo"
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleChange}
                        required
                        size="small"
                    />
                    <TextField
                        label="Endereco"
                        name="endereco"
                        value={formData.endereco}
                        onChange={handleChange}
                        required
                        size="small"
                    />
                    <TextField
                        label="Cidade"
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleChange}
                        required
                        size="small"
                    />
                    <TextField
                        label="Uf"
                        name="uf"
                        value={formData.uf}
                        onChange={handleChange}
                        multiline
                        required
                        size="small"
                    />
                    <TextField
                        label="Valor"
                        name="valor"
                        value={formData.valor}
                        onChange={handleChange}
                        multiline
                        required
                        size="small"
                    />
                    <TextField
                        label="Descrição"
                        name="descricao"
                        value={formData.descricao}
                        onChange={handleChange}
                        multiline
                        rows={3}
                        required
                        size="small"
                    />
                </Box>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Salvar'}
                </Button>
                <Button onClick={onClose} variant="outlined">
                    Cancelar
                </Button>
            </Box>
        </Modal>
    );
};