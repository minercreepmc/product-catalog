import { SubCategoryAddedDomainEvent } from '@domain-events/category';
import { AddSubCategoriesMapper } from '@use-cases/add-sub-categories/application-services';
import {
  AddSubCategoriesRequestDto,
  AddSubCategoriesResponseDto,
} from '@use-cases/add-sub-categories/dtos';
import {
  CategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';

describe('AddSubCategoriesMapper', () => {
  let mapper: AddSubCategoriesMapper;

  beforeEach(() => {
    mapper = new AddSubCategoriesMapper();
  });

  describe('toDomain', () => {
    it('should return an AddSubCategoriesDomainOptions object with the correct properties', () => {
      const command: AddSubCategoriesRequestDto = {
        categoryId: '1',
        subCategoryIds: ['2', '3'],
      };

      const result = mapper.toDomain(command);

      expect(result).toEqual({
        categoryId: new CategoryIdValueObject('1'),
        subCategoryIds: [
          new SubCategoryIdValueObject('2'),
          new SubCategoryIdValueObject('3'),
        ],
      });
    });
  });

  describe('toResponseDto', () => {
    it('should return an AddSubCategoriesResponseDto object with the correct properties', () => {
      const event: SubCategoryAddedDomainEvent =
        new SubCategoryAddedDomainEvent({
          id: new SubCategoryIdValueObject('1'),
          details: {
            subCategoryIds: [
              new SubCategoryIdValueObject('2'),
              new SubCategoryIdValueObject('3'),
            ],
          },
        });

      const result = mapper.toResponseDto(event);

      expect(result).toEqual({
        categoryId: '1',
        subCategoryIds: ['2', '3'],
      });
      expect(result).toBeInstanceOf(AddSubCategoriesResponseDto);
    });
  });
});
