import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { USERS_ROLE } from '@v2/users/constants';
import { JwtGuard } from '@guards/jwt';
import { RoleGuard } from '@guards/roles';
import { ApiApplication } from '@constants';
import { UploadService } from './upload.service';
import { DestroyFileDto, UploadFilesDto } from './dto';

@Controller(ApiApplication.UPLOAD.CONTROLLER)
@UseGuards(JwtGuard, RoleGuard(USERS_ROLE.ADMIN))
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @FormDataRequest()
  @Post(ApiApplication.UPLOAD.UPLOAD)
  upload(@Body() dto: UploadFilesDto) {
    return this.uploadService.upload(dto);
  }

  @Post(ApiApplication.UPLOAD.DESTROY)
  destroy(@Body() dto: DestroyFileDto) {
    return this.uploadService.delete(dto);
  }
}
