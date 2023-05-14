import { ParentCategoryAddedDomainEvent } from '@domain-events/category';
import { AddParentCategoriesMapper } from '@use-cases/add-parent-categories/application-services';
import {
  AddParentCategoriesCommand,
  AddParentCategoriesResponseDto,
} from '@use-cases/add-parent-categories/dtos';
import {
  CategoryIdValueObject,
  ParentCategoryIdValueObject,
} from '@value-objects/category';

describe('AddParentCategoriesMapper', () => {
  let mapper: AddParentCategoriesMapper;

  beforeEach(() => {
    mapper = new AddParentCategoriesMapper();
  });

  describe('toDomain', () => {
    it('should return an AddParentCategoriesDomainOptions object with the correct properties', () => {
      const command: AddParentCategoriesCommand = {
        categoryId: '1',
        parentIds: ['2', '3'],
      };

      const result = mapper.toDomain(command);

      expect(result).toEqual({
        categoryId: new CategoryIdValueObject('1'),
        parentIds: [
          new ParentCategoryIdValueObject('2'),
          new ParentCategoryIdValueObject('3'),
        ],
      });
    });
  });

  describe('toResponseDto', () => {
    it('should return an AddParentCategoriesResponseDto object with the correct properties', () => {
      const event: ParentCategoryAddedDomainEvent =
        new ParentCategoryAddedDomainEvent({
          id: new CategoryIdValueObject('1'),
          details: {
            parentIds: [
              new ParentCategoryIdValueObject('2'),
              new ParentCategoryIdValueObject('3'),
            ],
          },
        });

      const result = mapper.toResponseDto(event);

      expect(result).toEqual({
        categoryId: '1',
        parentIds: ['2', '3'],
      });
      expect(result).toBeInstanceOf(AddParentCategoriesResponseDto);
    });
  });
});
