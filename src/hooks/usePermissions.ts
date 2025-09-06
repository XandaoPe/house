import { useAuth } from '../contexts/AuthContext';

export const usePermissions = () => {
    const { hasPermission, user } = useAuth();

    const canAccess = (requiredRole: string): boolean => {
        return hasPermission(requiredRole);
    };

    const isAdmin = (): boolean => {
        return hasPermission('ADMIN');
    };

    const isModerator = (): boolean => {
        return hasPermission('MODERATOR');
    };

    const getUserRole = (): string => {
        return user?.role || 'USER';
    };

    return {
        canAccess,
        isAdmin,
        isModerator,
        getUserRole
    };
};