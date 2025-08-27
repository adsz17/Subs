import { Role } from '@prisma/client';

export const isAdminOrStaff = (role?: Role | null) => role === 'ADMIN' || role === 'STAFF';

export const hasRole = (userRole: Role, allowed: Role[]) => allowed.includes(userRole);
