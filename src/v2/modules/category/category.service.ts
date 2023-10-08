import { PaginationParams } from '@constants';
import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepository) {}
  create(dto: CreateCategoryDto) {
    return this.categoryRepo.create(dto);
  }

  update(id: string, dto: UpdateCategoryDto) {
    return this.categoryRepo.updateOneById(id, dto);
  }

  getOne(id: string) {
    return this.categoryRepo.findOneById(id);
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

  deleteMany(ids: string[]) {
    return this.categoryRepo.deleteManyByIds(ids);
  }
}
