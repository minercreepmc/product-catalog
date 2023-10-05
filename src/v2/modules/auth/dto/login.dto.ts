import { IsString } from 'class-validator';

export class LogInDto {
  @IsString()
  username: string;
}