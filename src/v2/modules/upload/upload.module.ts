import { Module } from '@nestjs/common';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [NestjsFormDataModule.config({ storage: MemoryStoredFile })],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
