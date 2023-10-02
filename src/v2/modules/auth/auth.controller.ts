import { RequestWithUser } from '@api/http';
import { ApiApplication } from '@constants';
import { JwtGuard } from '@guards/jwt';
import { LocalAuthenticationGuard } from '@guards/local';
import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from '@v2/users/user.service';
import { Response as ExpressResponse } from 'express';
import { AuthService } from './auth.service';
import { ProfileRO } from './ro';

@Controller(ApiApplication.AUTH.CONTROLLER)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(LocalAuthenticationGuard)
  @Post(ApiApplication.AUTH.LOGIN)
  async logIn(@Req() req: RequestWithUser, @Res() res: ExpressResponse) {
    const cookie = await this.authService.logIn({
      username: req.user.username,
    });
    res.setHeader('Set-Cookie', cookie);
    return res.json({
      cookie,
    });
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
