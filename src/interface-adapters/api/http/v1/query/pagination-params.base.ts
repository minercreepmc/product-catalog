import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationParams {
  @IsOptional()
  offset?: number;
  @IsOptional()
  limit?: number;
}
