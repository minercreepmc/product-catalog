import { RequestWithUser } from '@constants';
import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { UserRole } from '@v2/users/constants';

export const RoleGuard = (...roles: UserRole[]): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;
      return roles.some((role) => user?.role === role);
    }
  }

  return mixin(RoleGuardMixin);
};
