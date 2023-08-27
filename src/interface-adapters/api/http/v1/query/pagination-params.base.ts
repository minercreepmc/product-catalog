import { IsOptional } from 'class-validator';

export class PaginationParams {
  @IsOptional()
  offset?: number;
  @IsOptional()
  limit?: number;
}
