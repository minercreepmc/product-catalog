import { Injectable, NotFoundException } from '@nestjs/common';
import type { PaginationParams } from '@constants';
import { CategoryRepository } from './category.repository';
import type { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepository) {}
  create(dto: CreateCategoryDto) {
    return this.categoryRepo.create(dto);
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const { productIds } = dto;
    const category = await this.categoryRepo.updateOneById(id, dto);

    if (productIds) {
      const result = await this.categoryRepo.updateProductsFromCategory(
        category.id,
        productIds,
      );
      const productsUpdated = result ? result : { productIds };
      category.productIds = productsUpdated?.productIds;
    }

    return category;
  }

  async getOne(id: string) {
    const category = await this.categoryRepo.findOneById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  getAll(params: PaginationParams) {
    return this.categoryRepo.findAll(params);
  }

  getAllWithProductCount() {
    return this.categoryRepo.findAllWithProductCount();
  }

  deleteOne(id: string) {
    return this.categoryRepo.deleteOneById(id);
  }

  async deleteMany(ids: string[]) {
    const deleteds: string[] = [];

    for (const id of ids) {
      const deleted = await this.categoryRepo.deleteOneById(id);
      if (deleted) {
        deleteds.push(deleted);
      } else {
        break;
      }
    }

    return deleteds ? deleteds : [];
  }
}
