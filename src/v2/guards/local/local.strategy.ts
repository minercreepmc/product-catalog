import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserModel } from '@v2/users';
import { Strategy } from 'passport-local';
import { AuthService } from '@v2/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'username',
    });
  }
  async validate(username: string, password: string): Promise<UserModel> {
    return this.authService.getAuthenticatedUser(username, password);
  }
}
