import { Result } from 'oxide.ts';
import { CreateCategoryResponseDto } from './create-category.response.dto';

export type CreateCategoryResult = Result<CreateCategoryResponseDto, any>;
