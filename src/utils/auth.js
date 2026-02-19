import { authService } from '@/services/auth.service';

export const logout = async () => {
    try {
        await authService.logout();
    } catch (e) {
        console.error('Logout failed', e);
    } finally {
        window.location.href = '/auth/login';
    }
};
