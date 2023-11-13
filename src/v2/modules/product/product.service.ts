import { Injectable } from '@nestjs/common';
import type { PaginationParams } from '@constants';
import { ProductRepository } from './product.repository';
import type { CreateProductDto, UpdateProductDto } from './dto';
import { UpdateProductRO } from './ro';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ProductService {
  constructor(private readonly productRepo: ProductRepository) {}
  create(dto: CreateProductDto) {
    return this.productRepo.create(dto);
  }

  async update(id: string, dto: UpdateProductDto) {
    const { categoryIds, discountId } = dto;
    const updated = await this.productRepo.updateOneById(id, dto);
    let category_ids: string[] = [];
    let discount_id = null;

    if (categoryIds && categoryIds.length >= 0) {
      category_ids = await this.productRepo.updateCategoryIds({
        id,
        categoryIds,
      });
    }

    if (discountId || discountId === null) {
      discount_id = await this.productRepo.updateDiscount({
        id,
        discountId,
      });
    }

    return plainToInstance(
      UpdateProductRO,
      {
        ...updated,
        category_ids,
        discount_id,
      },
      { excludeExtraneousValues: true },
    );
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
