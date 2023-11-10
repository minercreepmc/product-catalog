import { SetMetadata } from '@nestjs/common';
import type { USERS_ROLE } from '@v2/users/constants';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: USERS_ROLE[]) => {
  return SetMetadata(ROLES_KEY, roles);
};
