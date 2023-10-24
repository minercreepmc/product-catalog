import { PaginationParams } from '@constants';
import { Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly productRepo: ProductRepository) {}
  create(dto: CreateProductDto) {
    return this.productRepo.create(dto);
  }

  update(id: string, dto: UpdateProductDto) {
    return this.productRepo.updateOneById(id, dto);
  }

  getOne(id: string) {
    return this.productRepo.findByIdWithDetails(id);
  }

  getAll(params: PaginationParams) {
    return this.productRepo.findAllWithDetails(params);
  }

  getAllWithImages(params: PaginationParams) {
    return this.productRepo.findAllWithImages(params);
  }

  getSoldProductDaily() {
    return this.productRepo.getSoldProductDaily();
  }

  getSoldProductMonthly() {
    return this.productRepo.getSoldProductMonthly();
  }

  getSoldProductWeekly() {
    return this.productRepo.getSoldProductWeekly();
  }

  deleteOneById(id: string) {
    return this.productRepo.deleteOneById(id);
  }

  deleteManyByIds(ids: string[]) {
    return this.productRepo.deleteManyByIds(ids);
  }
}
