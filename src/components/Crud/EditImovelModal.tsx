import * as React from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
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

    const handleChange = (e: any) => {
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
            onSuccess(formData);
            onClose();
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
                <Box sx={{ ...textFieldSx, mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }} >
                    <FormControl sx={{ flex: '1 1 32%' }} size="small" required>
                        <InputLabel id="tipo-label">Tipo</InputLabel>
                        <Select
                            labelId="tipo-label"
                            id="tipo-select"
                            name="tipo"
                            value={formData.tipo}
                            label="Tipo"
                            onChange={handleChange}
                            sx={{ ...textFieldSx, color: 'white' }}
                        >
                            <MenuItem value="01">01</MenuItem>
                            <MenuItem value="02">02</MenuItem>
                            <MenuItem value="03">03</MenuItem>
                            <MenuItem value="República Masculina 01">República Masculina 01</MenuItem>
                            <MenuItem value="República Masculina 02">República Masculina 02</MenuItem>
                            <MenuItem value="República Masculina 03">República Masculina 03</MenuItem>
                            <MenuItem value="República Feminina 01">República Feminina 01</MenuItem>
                            <MenuItem value="República Feminina 02">República Feminina 02</MenuItem>
                            <MenuItem value="República Feminina 03">República Feminina 03</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        sx={{ flex: '1 1 52%' }}
                        label="Rua"
                        name="rua"
                        value={formData.rua}
                        onChange={handleChange}
                        required
                        size="small"
                    />
                    <TextField
                        sx={{ flex: '1 1 12%' }}
                        label="Número"
                        name="numero"
                        value={formData.numero}
                        onChange={handleChange}
                        required
                        size="small"
                    />
                    <TextField
                        sx={{ flex: '1 1 40%' }}
                        label="Complemento"
                        name="complemento"
                        value={formData.complemento}
                        onChange={handleChange}
                        size="small"
                    />
                    <TextField
                        sx={{ flex: '1 1 18%' }}
                        label="CEP"
                        name="cep"
                        value={formData.cep}
                        onChange={handleChange}
                        required
                        size="small"
                    />
                    <TextField
                        sx={{ flex: '1 1 30%' }}
                        label="Cidade"
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleChange}
                        required
                        size="small"
                    />
                    <TextField
                        sx={{ flex: '1 1 08%' }}
                        label="Uf"
                        name="uf"
                        value={formData.uf}
                        onChange={handleChange}
                        required
                        size="small"
                    />
                    <TextField
                        sx={{ flex: '1 1 48%' }}
                        label="Copasa"
                        name="copasa"
                        value={formData.copasa}
                        onChange={handleChange}
                        size="small"
                        />
                    <TextField
                        sx={{ flex: '1 1 48%' }}
                        label="Cemig"
                        name="cemig"
                        value={formData.cemig}
                        onChange={handleChange}
                        size="small"
                        />
                    <TextField
                        sx={{ flex: '1 1 100%' }}
                        label="Observação"
                        name="obs"
                        value={formData.obs}
                        onChange={handleChange}
                        multiline
                        rows={2}
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