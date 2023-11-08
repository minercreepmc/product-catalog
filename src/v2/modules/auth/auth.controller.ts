import { ApiApplication, RequestWithUser } from '@constants';
import { JwtGuard } from '@guards/jwt';
import { LocalAuthenticationGuard } from '@guards/local';
import { RoleGuard } from '@guards/roles';
import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { UserRole } from '@v2/users/constants';
import { UserService } from '@v2/users/user.service';
import type { Response as ExpressResponse } from 'express';
import { AuthService } from './auth.service';
import type { ProfileRO } from './ro';

@Controller(ApiApplication.AUTH.CONTROLLER)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post(ApiApplication.AUTH.IS_LOGGED_IN)
  async isLoggedIn(@Req() req: Request) {
    const cookie =
      req?.headers?.cookie
        ?.split(';')
        .find((cookie) => cookie.trim().startsWith('Authentication='))
        ?.split('=')[1] || '';
    return this.authService.isLoggedIn(cookie);
  }

  @UseGuards(LocalAuthenticationGuard)
  @Post(ApiApplication.AUTH.LOGIN)
  async logIn(@Req() req: RequestWithUser, @Res() res: ExpressResponse) {
    const { cookie, user } = await this.authService.logIn({
      username: req.user.username,
    });
    res.setHeader('Set-Cookie', cookie);
    return res.json(user);
  }

  @Post(ApiApplication.AUTH.LOGIN_DASHBOARD)
  @UseGuards(
    LocalAuthenticationGuard,
    RoleGuard(UserRole.ADMIN, UserRole.STAFF, UserRole.SHIPPER),
  )
  async logInDashboard(
    @Req() req: RequestWithUser,
    @Res() res: ExpressResponse,
  ) {
    const { cookie, user } = await this.authService.logIn({
      username: req.user.username,
    });
    res.setHeader('Set-Cookie', cookie);
    return res.json(user);
  }

  @UseGuards(JwtGuard)
  @Post(ApiApplication.AUTH.LOGOUT)
  async logOut(@Res() res: ExpressResponse) {
    const cookie = this.authService.getLogOutCookie();
    res.setHeader('Set-Cookie', cookie);
    return res.json({
      cookie,
    });
  }

  @UseGuards(JwtGuard)
  @Get(ApiApplication.AUTH.GET_PROFILE)
  async getProfile(@Req() req: RequestWithUser): Promise<ProfileRO> {
    return this.userService.getOne(req.user.id);
  }
}
