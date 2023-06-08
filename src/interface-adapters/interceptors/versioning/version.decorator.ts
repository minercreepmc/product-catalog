import { applyDecorators, Controller } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';

export const VERSION_METADATA_KEY = 'version';

export const VersionPrefix = (version: string) =>
  applyDecorators(
    Controller(`/v${version}`),
    SetMetadata(VERSION_METADATA_KEY, version),
  );
