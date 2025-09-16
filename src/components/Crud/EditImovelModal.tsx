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
import { updateImovel } from '../../components/services/imovesService';
import { Imovel } from '../../interfaces/Imovel';
import { styleModal, textFieldSx } from '../../styles/styles';

interface EditImovelModalProps {
    open: boolean;
    imovel: Imovel | null;
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

export const EditImovelModal: React.FC<EditImovelModalProps> = ({ open, imovel, onClose, onSuccess }) => {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [formData, setFormData] = React.useState<Imovel | null>(null);

    React.useEffect(() => {
        if (imovel) {
            setFormData(imovel);
        }
    }, [imovel]);

    if (!formData) {
        return null;
    }

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
            await updateImovel(formData);
            onSuccess(formData); // Chama o callback de sucesso com os dados atualizados
            onClose(); // Fecha a modal
        } catch (err) {
            setError('Falha ao atualizar o imóvel. Verifique os dados e tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle} component="form" onSubmit={handleSubmit}>
                <Typography variant="h6" component="h2">
                    Editar Imóvel
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
                    {loading ? <CircularProgress size={24} /> : 'Salvar Alterações'}
                </Button>
                <Button onClick={onClose} variant="outlined">
                    Cancelar
                </Button>
            </Box>
        </Modal>
    );
};