export type Role = 'ADMIN' | 'STAFF' | 'CUSTOMER';

export const isAdminOrStaff = (role?: string | null) => role === 'ADMIN' || role === 'STAFF';
