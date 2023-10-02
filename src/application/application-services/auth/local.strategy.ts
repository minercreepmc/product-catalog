import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserModel } from '@v2/users/model';
import { Strategy } from 'passport-local';
import { AuthApplicationService } from './auth.applicaton-service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authenticationService: AuthApplicationService) {
    super({
      usernameField: 'username',
    });
  }
  async validate(username: string, password: string): Promise<UserModel> {
    return this.authenticationService.getAuthenticatedUser(username, password);
  }
}
