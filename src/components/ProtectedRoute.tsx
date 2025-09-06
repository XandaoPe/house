import React from 'react';
import { CircularProgress, Box, Alert } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: string; // Role mínimo necessário
    showMessage?: boolean; // Se deve mostrar mensagem de acesso negado
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredRole = 'user',
    showMessage = true
}) => {
    const { user, isLoading, hasPermission } = useAuth();

    if (isLoading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!user) {
        window.location.href = '/login';
        return null;
    }

    if (!hasPermission(requiredRole)) {
        if (showMessage) {
            return (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="50vh"
                    padding={3}
                >
                    <Alert severity="error" sx={{ maxWidth: 400 }}>
                        Acesso negado. Você não possui permissão para acessar esta página.
                        <br />
                        <strong>Perfil necessário:</strong> {requiredRole}
                        <br />
                        <strong>Seu perfil:</strong> {user.role}
                    </Alert>
                </Box>
            );
        }
        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute;