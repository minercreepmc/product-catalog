import { Result } from 'oxide.ts';
import { AddParentCategoriesResponseDto } from './add-parent-categories.response.dto';

export type AddParentCategoriesResult = Result<
  AddParentCategoriesResponseDto,
  any
>;
