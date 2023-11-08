import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '@v2/users/constants';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => {
  return SetMetadata(ROLES_KEY, roles);
};
