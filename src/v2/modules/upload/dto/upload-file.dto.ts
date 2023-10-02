import { IsString, IsUrl } from 'class-validator';
import {
  HasMimeType,
  IsFiles,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';

export class UploadFilesDto {
  @IsFiles()
  @MaxFileSize(3 * 1024 * 1024, { each: true })
  @HasMimeType(['image/jpeg', 'image/png', 'image/webp', 'image/jpg'], {
    each: true,
  })
  files: MemoryStoredFile[];
}

export class DestroyFileDto {
  @IsString()
  @IsUrl()
  fileUrl: string;
}
