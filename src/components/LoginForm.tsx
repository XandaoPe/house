import React, { useState } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { primaryButtonSx, styleModal, textFieldSx } from '../styles/styles';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const success = await login(email, password);
            if (success) {
                navigate('/'); // ← Isso deve redirecionar para a página principal
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
                <Paper elevation={3} sx={{
                    ...styleModal,
                    padding: 4,
                    width: '30%',
                    borderRadius: 10,
                    border: '2px solid #4a4b4b7e'
                }}>
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
                            sx={{...textFieldSx}}
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
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
                            autoComplete="current-password"
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
                </Paper>
            </Box>
        </Container>
    );
};

export default LoginForm;