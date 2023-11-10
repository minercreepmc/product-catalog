import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { RequestWithUser } from '@constants';
import { USERS_ROLE } from '@v2/users/constants';

export const RoleGuard = (...roles: USERS_ROLE[]): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;
      return roles.some((role) => user?.role === role);
    }
  }

  return mixin(RoleGuardMixin);
};
