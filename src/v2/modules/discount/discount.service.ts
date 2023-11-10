import { Injectable } from '@nestjs/common';
import type { PaginationParams } from '@constants';
import { DiscountRepository } from './discount.repository';
import type { CreateDiscountDto, UpdateDiscountDto } from './dto';

@Injectable()
export class DiscountService {
  constructor(private readonly discountRepo: DiscountRepository) {}

  create(dto: CreateDiscountDto) {
    return this.discountRepo.create(dto);
  }

  deleteOneById(id: string) {
    return this.discountRepo.deleteOneById(id);
  }

  updateOneById(id: string, dto: UpdateDiscountDto) {
    return this.discountRepo.updateOneById(id, dto);
  }

  getOneById(id: string) {
    return this.discountRepo.findOneById(id);
  }

  getAll(params: PaginationParams) {
    return this.discountRepo.findAll(params);
  }

  getAllWithProductCount() {
    return this.discountRepo.findAllWithProductCount();
  }
}
