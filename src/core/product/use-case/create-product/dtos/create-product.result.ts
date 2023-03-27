import { Result } from 'oxide.ts';
import { CreateProductResponseDto } from './create-product.response.dto';

export type CreateProductResult = Result<CreateProductResponseDto, any>;
