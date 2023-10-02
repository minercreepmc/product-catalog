import { PaginationParams } from '@constants';
import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly productRepo: ProductRepository) {}
  create(dto: CreateProductDto) {
    return this.productRepo.create(dto);
  }

  update(id: string, dto: CreateProductDto) {
    return this.productRepo.updateOneById(id, dto);
  }

  getOne(id: string) {
    return this.productRepo.findByIdWithDetails(id);
  }

  getAll(params: PaginationParams) {
    return this.productRepo.findAll(params);
  }

  deleteOneById(id: string) {
    return this.productRepo.deleteOneById(id);
  }

  deleteManyByIds(ids: string[]) {
    return this.productRepo.deleteManyByIds(ids);
  }
}
