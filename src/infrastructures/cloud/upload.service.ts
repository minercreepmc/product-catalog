import { Injectable, Logger } from '@nestjs/common';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { FileValueObject } from '@value-objects/file.value-object';

export interface UploadOptions {
  fileName: string;
  file: Buffer;
}

@Injectable()
export class UploadService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });

  private readonly logger = new Logger(UploadService.name);
  constructor(private readonly configService: ConfigService) {}

  async upload(file: FileValueObject): Promise<string> {
    const { name, value } = file;
    const bucket = this.configService.getOrThrow('AWS_S3_BUCKET');
    const key = `${uuidv4()}${name}`;
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: value,
      ACL: 'public-read',
    });

    try {
      const response: PutObjectCommandOutput = await this.s3Client.send(
        command,
      );
      if (response.$metadata.httpStatusCode === 200) {
        return `https://${bucket}.s3.${this.configService.getOrThrow(
          'AWS_S3_REGION',
        )}.amazonaws.com/${key}`;
      }
      throw new Error('File not save to s3');
    } catch (err) {
      this.logger.error('Cannot save file to s3', err);
      throw err;
    }
  }

  async delete(fileUrl: string): Promise<void> {
    const key = fileUrl.split('.amazonaws.com/')[1];

    const deleteParams = {
      Bucket: this.configService.getOrThrow('AWS_S3_BUCKET'),
      Key: key,
    };

    try {
      const response: PutObjectCommandOutput = await this.s3Client.send(
        new DeleteObjectCommand(deleteParams),
      );
      if (response.$metadata.httpStatusCode === 200) {
        return;
      }
      throw new Error('File not delete from s3');
    } catch (err) {
      this.logger.error('Cannot delete file from s3', err);
      throw err;
    }
  }
}
