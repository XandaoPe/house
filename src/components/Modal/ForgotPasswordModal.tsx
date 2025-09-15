import React, { useState, useEffect } from 'react';
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
    const [isCodeSentCompleted, setIsCodeSentCompleted] = useState(false);
    const [isResendDisabled, setIsResendDisabled] = useState(false);
    // NOVO ESTADO: Para o contador de tempo
    const [resendTimer, setResendTimer] = useState(0);

    const resetFormState = () => {
        setResetEmail('');
        setResetCode('');
        setNewPassword('');
        setIsCodeSent(false);
        setResetError('');
        setResetSuccess('');
        setIsResetting(false);
        setIsResetCompleted(false);
        setIsCodeSentCompleted(false);
        setIsResendDisabled(false);
        setResendTimer(0); // Reinicia o temporizador
    };

    // NOVO useEffect: para gerenciar a contagem regressiva
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isResendDisabled && resendTimer > 0) {
            timer = setTimeout(() => {
                setResendTimer(resendTimer - 1);
            }, 1000);
        } else if (resendTimer === 0) {
            setIsResendDisabled(false);
        }
        return () => clearTimeout(timer);
    }, [isResendDisabled, resendTimer]);

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
                setIsCodeSentCompleted(true);
            } else {
                setIsCodeSent(true);
                setResetSuccess('Se o e-mail estiver cadastrado, um código foi enviado.');
                setIsCodeSentCompleted(true);
            }
        } catch (err) {
            setResetError('Não foi possível enviar o código. Tente novamente.');
        } finally {
            setIsResetting(false);
            setIsResendDisabled(true); // Desativa o botão
            setResendTimer(20); // Inicia o contador de 15 segundos
        }
    };

    const handleResendCode = async () => {
        setResetError('');
        setResetSuccess('');
        setIsResendDisabled(true); // Desativa o botão imediatamente
        setResendTimer(20); // Inicia o contador de 15 segundos

        try {
            const response = await fetch('http://localhost:5000/users/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: resetEmail }),
            });
            if (response.ok) {
                setResetSuccess('Um novo código foi enviado para o seu e-mail.');
            } else {
                setResetError('Não foi possível reenviar o código. Tente novamente.');
            }
        } catch (err) {
            setResetError('Não foi possível reenviar o código. Tente novamente.');
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
                        <Button
                            fullWidth
                            variant="text"
                            onClick={handleResendCode}
                            sx={{ ...primaryButtonSx, mt: 2 }}
                            disabled={isResendDisabled || isResetting || isResetCompleted}
                        >
                            {/* EXIBIÇÃO CONDICIONAL: Título do botão com o contador */}
                            {resendTimer > 0 ? `Reenviar Código em ${resendTimer}s` : 'Reenviar Código'}
                        </Button>
                    </Box>
                )}
            </Box>
        </Modal>
    );
};

export default ForgotPasswordModal;