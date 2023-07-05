import { Module } from '@nestjs/common';
import { UploadService } from '@src/infrastructures/cloud';

@Module({
  imports: [],
  providers: [UploadService],
})
export class UploadModule {}
