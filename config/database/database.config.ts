import { ConfigService } from '@nestjs/config';

export interface DatabaseConfigOptions {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

const configService = new ConfigService();
export const databaseConfig: DatabaseConfigOptions = {
  host: configService.get('POSTGRES_HOST')!,
  port: configService.get('POSTGRES_PORT')!,
  user: configService.get('POSTGRES_USER')!,
  password: configService.get('POSTGRES_PASSWORD')!,
  database: configService.get('POSTGRES_DB')!,
};
