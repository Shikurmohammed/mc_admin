export interface OrdersTableProps {
    userRole?: 'ADMIN' | 'ARTISAN' | 'CUSTOMER';
    statusFilter: string;
}