import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";


export const redirectByRole = (role: string, router: AppRouterInstance) => {
    switch (role) {
        case 'ADMIN':
            router.push('/dashboard/admin');
            break;
        case 'ARTISAN':
            router.push('/dashboard/artisan');
            break;
        case 'CUSTOMER':
            router.push('/dashboard/customer');
            break;
        default:
            router.push('/');
    }
};
