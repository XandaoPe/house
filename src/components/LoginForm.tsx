// src/components/LoginForm.tsx
import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    Tooltip, // 👈 Importe Tooltip
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { primaryButtonSx, styleModal, textFieldSx } from '../styles/styles';
import ForgotPasswordModal from '../components/Modal/ForgotPasswordModal';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    // NOVO ESTADO: Para controlar se o Tooltip está aberto
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    // NOVAS FUNÇÕES: Para abrir e fechar o Tooltip
    const handleOpenTooltip = () => setIsTooltipOpen(true);
    const handleCloseTooltip = () => setIsTooltipOpen(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const success = await login(email, password);
            if (success) {
                navigate('/');
            } else {
                setError('Credenciais inválidas. Por favor, tente novamente.');
            }
        } catch (err) {
            setError('Ocorreu um erro durante o login. Tente novamente !');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 7,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        ...styleModal,
                        padding: 4,
                        width: '30%',
                        borderRadius: 10,
                        border: '2px solid #4a4b4b7e',
                    }}
                >
                    <Typography component="h1" variant="h5" align="center" gutterBottom>
                        Login
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            sx={textFieldSx}
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="nada"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            sx={textFieldSx}
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Senha"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ ...primaryButtonSx, mt: 3, mb: 2 }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Entrando...' : 'Entrar'}
                        </Button>
                    </Box>

                    {/* NOVO ELEMENTO: Tooltip para o "Primeiro Acesso?" */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: '100%',
                            mt: 1,
                        }}
                    >
                        <Tooltip
                            open={isTooltipOpen}
                            onClose={handleCloseTooltip}
                            onOpen={handleOpenTooltip}
                            title="Insira o Seu email(somente cadastrados no sistema), digite esta senha: 123456. Após logado, altere para sua senha preferida(botão ALTERAR SENHA)."
                            arrow // Adiciona uma seta ao pop-up
                            placement="top" // Posição do pop-up
                        >
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ color: "white", cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                            >
                                Primeiro Acesso?
                            </Typography>
                        </Tooltip>
                    </Box>

                    <Button
                        onClick={handleOpenModal}
                        fullWidth
                        sx={{ textTransform: 'none', mt: 1, color: '#ca7272' }}
                    >
                        Esqueci a senha !!! 😩😩😩
                    </Button>
                </Paper>
            </Box>

            <ForgotPasswordModal open={isModalOpen} onClose={handleCloseModal} />
        </Container>
    );
};

export default LoginForm;