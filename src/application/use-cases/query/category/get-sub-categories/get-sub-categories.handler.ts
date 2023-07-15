import { ResponseDtoBase } from '@base/use-cases';
import { CategoryMikroOrmModel } from '@database/repositories/mikroorm/category';
import { EntityManager } from '@mikro-orm/postgresql';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CategoryQuery } from '@use-cases/query/category';
import { GetSubCategoriesQuery } from './get-sub-categories.query';

export class GetSubCategoriesResponseDto extends ResponseDtoBase {
  subCategories: string[];

  constructor(options: any) {
    super();
    this.subCategories = options.subCategories;
  }
}
export interface CategoryPopulateOptions {
  subCategories?: boolean;
  parentCategories?: boolean;
}

@QueryHandler(GetSubCategoriesQuery)
export class GetSubCategoriesHandler
  implements IQueryHandler<CategoryQuery, GetSubCategoriesResponseDto>
{
  async execute(query: CategoryQuery): Promise<GetSubCategoriesResponseDto> {
    const { where } = query;
    const category = await this.entityManager.findOne<CategoryMikroOrmModel>(
      CategoryMikroOrmModel,
      where,
    );

    const subCategoryIds = category.subIds;
    let subCategories = [];

    if (subCategoryIds && subCategoryIds.length > 0) {
      subCategories = await this.entityManager.find(CategoryMikroOrmModel, {
        id: { $in: category.subIds },
      });
    }

    return new GetSubCategoriesResponseDto({
      subCategories,
    });
  }

  constructor(private readonly entityManager: EntityManager) {}
}
