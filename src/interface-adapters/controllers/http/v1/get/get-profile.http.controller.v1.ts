import { v1ApiEndpoints } from '@api/http';
import { RequestWithUser } from '@api/http/v1/models/user.model.v1';
import { JwtAuthenticationGuard } from '@application/application-services/auth';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';

@Controller(v1ApiEndpoints.getProfile)
export class V1GetProfileHttpController {
  @Get()
  @UseGuards(JwtAuthenticationGuard)
  async execute(@Req() request: RequestWithUser): Promise<any> {
    const user = request.user;
    return user;
  }
}
