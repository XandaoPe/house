import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
} from '@mui/material';
import { primaryButtonSx, styleModal, textFieldSx } from '../../styles/styles';

interface ForgotPasswordModalProps {
    open: boolean;
    onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ open, onClose }) => {
    const [resetEmail, setResetEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [resetError, setResetError] = useState('');
    const [resetSuccess, setResetSuccess] = useState('');
    const [isResetting, setIsResetting] = useState(false);
    const [isResetCompleted, setIsResetCompleted] = useState(false);
    // 👈 NOVO ESTADO: Para controlar o botão de envio de código
    const [isCodeSentCompleted, setIsCodeSentCompleted] = useState(false);

    const resetFormState = () => {
        setResetEmail('');
        setResetCode('');
        setNewPassword('');
        setIsCodeSent(false);
        setResetError('');
        setResetSuccess('');
        setIsResetting(false);
        setIsResetCompleted(false);
        setIsCodeSentCompleted(false); // 👈 Limpa o novo estado ao fechar a modal
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsResetting(true);
        setResetError('');
        setResetSuccess('');

        try {
            const response = await fetch('http://localhost:5000/users/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: resetEmail }),
            });

            if (response.ok) {
                setIsCodeSent(true);
                setResetSuccess('Um código foi enviado para o seu e-mail. Verifique sua caixa de entrada.');
                setIsCodeSentCompleted(true); // 👈 ATIVA O NOVO ESTADO AQUI
            } else {
                setIsCodeSent(true);
                setResetSuccess('Se o e-mail estiver cadastrado, um código foi enviado.');
                setIsCodeSentCompleted(true); // 👈 Ative o estado mesmo se o e-mail não existir
            }
        } catch (err) {
            setResetError('Não foi possível enviar o código. Tente novamente.');
        } finally {
            setIsResetting(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsResetting(true);
        setResetError('');

        try {
            const response = await fetch('http://localhost:5000/users/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: resetEmail,
                    code: resetCode,
                    newPassword: newPassword,
                }),
            });

            if (response.ok) {
                setResetSuccess('Senha alterada com sucesso! Você pode fazer login agora.');
                setIsResetCompleted(true);
                setIsCodeSent(false);
                setTimeout(() => {
                    onClose();
                    resetFormState();
                }, 3000);
            } else {
                const errorData = await response.json();
                setResetError(errorData.message || 'Código inválido ou expirado.');
            }
        } catch (err) {
            setResetError('Ocorreu um erro ao redefinir a senha. Tente novamente.');
        } finally {
            setIsResetting(false);
        }
    };

    return (
        <Modal
            open={open}
            onClose={() => {
                onClose();
                resetFormState();
            }}
        >
            <Box sx={{ ...styleModal, width: 400, p: 4, borderRadius: 2 }}>
                <Typography variant="h6" align="center" gutterBottom>
                    Redefinir Senha
                </Typography>
                {resetError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {resetError}
                    </Alert>
                )}
                {resetSuccess && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {resetSuccess}
                    </Alert>
                )}

                {!isCodeSent ? (
                    <Box component="form" onSubmit={handleForgotPassword} sx={{ mt: 1 }}>
                        <TextField
                            sx={textFieldSx}
                            margin="normal"
                            required
                            fullWidth
                            id="reset-email"
                            label="E-mail"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            autoComplete="email"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ ...primaryButtonSx, mt: 2 }}
                            // 👈 AGORA, O BOTÃO É DESABILITADO SE JÁ ESTÁ REDEFININDO OU SE O CÓDIGO JÁ FOI ENVIADO
                            disabled={isResetting || isCodeSentCompleted}
                        >
                            {isResetting ? 'Enviando...' : 'Enviar Código'}
                        </Button>
                    </Box>
                ) : (
                    <Box component="form" onSubmit={handleResetPassword} sx={{ mt: 1 }}>
                        <TextField
                            sx={textFieldSx}
                            margin="normal"
                            required
                            fullWidth
                            id="reset-code"
                            label="Código de 6 dígitos"
                            value={resetCode}
                            onChange={(e) => setResetCode(e.target.value)}
                            autoComplete="off"
                        />
                        <TextField
                            sx={textFieldSx}
                            margin="normal"
                            required
                            fullWidth
                            id="new-password"
                            label="Nova Senha"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            autoComplete="new-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ ...primaryButtonSx, mt: 2 }}
                            disabled={isResetting || isResetCompleted}
                        >
                            {isResetting ? 'Redefinindo...' : 'Redefinir Senha'}
                        </Button>
                    </Box>
                )}
            </Box>
        </Modal>
    );
};

export default ForgotPasswordModal;