import { Injectable, Logger } from '@nestjs/common';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { DestroyFileDto, UploadFilesDto } from './dtos';

@Injectable()
export class UploadService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });

  private readonly logger = new Logger(UploadService.name);
  constructor(private readonly configService: ConfigService) {}

  async upload(dto: UploadFilesDto): Promise<string[]> {
    const { files } = dto;
    const bucket = this.configService.getOrThrow('AWS_S3_BUCKET');

    const sanitizeFilename = (filename) => {
      // Remove special characters and replace spaces with underscores
      return filename.replace(/[^\w.-]/g, '_');
    };

    const promises = files.map(async (file) => {
      const sanitizedFilename = sanitizeFilename(file.originalName);
      const key = `${uuidv4()}/${sanitizedFilename}`;
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ACL: 'public-read',
      });

      try {
        const response = await this.s3Client.send(command);
        if (response.$metadata.httpStatusCode === 200) {
          const url = `https://${bucket}.s3.${this.configService.getOrThrow(
            'AWS_S3_REGION',
          )}.amazonaws.com/${key}`;
          return url;
        }
        throw new Error('File not saved to s3');
      } catch (err) {
        this.logger.error('Cannot save file to s3', err);
        throw err;
      }
    });

    const data = await Promise.all(promises);
    return data;
  }

  async delete(dto: DestroyFileDto): Promise<void> {
    const { fileUrl } = dto;
    const key = fileUrl.split('.amazonaws.com/')[1];

    const deleteParams = {
      Bucket: this.configService.getOrThrow('AWS_S3_BUCKET'),
      Key: key,
    };

    try {
      const response: PutObjectCommandOutput = await this.s3Client.send(
        new DeleteObjectCommand(deleteParams),
      );
      if (response.$metadata.httpStatusCode === 204) {
        return;
      }
      throw new Error('File not delete from s3');
    } catch (err) {
      this.logger.error('Cannot delete file from s3', err);
      throw err;
    }
  }
}
