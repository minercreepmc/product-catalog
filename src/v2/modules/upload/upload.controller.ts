import { ApiApplication } from '@constants';
import { JwtGuard } from '@guards/jwt';
import { RoleGuard } from '@guards/roles';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserRole } from '@v2/users/constants';
import { FormDataRequest } from 'nestjs-form-data';
import { DestroyFileDto, UploadFilesDto } from './dto';
import { UploadService } from './upload.service';

@Controller(ApiApplication.UPLOAD.CONTROLLER)
@UseGuards(JwtGuard, RoleGuard(UserRole.ADMIN))
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
