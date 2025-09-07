// src/components/Modal/ChangePasswordModal.tsx
import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { primaryButtonSx, styleModal, textFieldSx } from '../../styles/styles';

interface ChangePasswordModalProps {
    open: boolean;
    onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ open, onClose }) => {
    const { user } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmNewPassword) {
            setError('A nova senha e a confirmação não coincidem.');
            return;
        }

        if (!user || !user.id) {
            setError('Usuário não autenticado.');
            return;
        }

        setLoading(true);
        try {
            await api.put(`/users/${user.id}/password`, {
                currentPassword,
                newPassword
            });
            setSuccess('Senha alterada com sucesso!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erro ao alterar a senha. Tente novamente.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        // Limpa os estados ao fechar o modal
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setError('');
        setSuccess('');
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{ ...styleModal, width: 400 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton onClick={handleClose}>
                        <CloseIcon
                            sx={{ color: 'red' }}
                        />
                    </IconButton>
                </Box>
                <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
                    Alterar Senha
                </Typography>
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Senha Atual"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        sx={textFieldSx}
                    />
                    <TextField
                        label="Nova Senha"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        sx={textFieldSx}
                    />
                    <TextField
                        label="Confirmar Nova Senha"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                        sx={textFieldSx}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={primaryButtonSx}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Alterar Senha'}
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};