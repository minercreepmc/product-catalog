import { UserSchema } from '@database/repositories/pg/user';
import { CanActivate, ExecutionContext } from '@nestjs/common';

const myCustomUserObject: UserSchema = {
  id: '123',
  role: 'admin',
  username: 'tinpham',
};

export class MockAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    req.user = myCustomUserObject;
    return true;
  }
}
