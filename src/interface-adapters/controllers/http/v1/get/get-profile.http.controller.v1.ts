import { v1ApiEndpoints } from '@api/http';
import { RequestWithUser } from '@api/http/v1/models/user.model.v1';
import { Controller, Post, Req } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

@Controller(v1ApiEndpoints.getProfile)
export class V1GetProfileHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Post()
  async execute(@Req() request: RequestWithUser): Promise<any> {
    const user = request.user;
  }
}
