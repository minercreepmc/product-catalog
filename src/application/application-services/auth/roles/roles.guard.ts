import { RequestWithUser } from '@api/http';
import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { UserRoleEnum } from '@value-objects/user';

export const RoleGuard = (role: UserRoleEnum): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;

      return user?.role === role;
    }
  }

  return mixin(RoleGuardMixin);
};
