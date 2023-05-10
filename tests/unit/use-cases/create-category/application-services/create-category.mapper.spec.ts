import { CategoryCreatedDomainEvent } from '@domain-events/category/category-created.domain-event';
import { CreateCategoryMapper } from '@use-cases/create-category/application-services';
import {
  CreateCategoryCommand,
  CreateCategoryDomainOptions,
  CreateCategoryResponseDto,
} from '@use-cases/create-category/dtos';
import {
  CategoryDescriptionValueObject,
  CategoryIdValueObject,
  CategoryNameValueObject,
  ParentCategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';
import { ProductIdValueObject } from '@value-objects/product';

describe('CreateCategoryMapper', () => {
  let mapper: CreateCategoryMapper;

  beforeEach(() => {
    mapper = new CreateCategoryMapper();
  });

  describe('toDomain', () => {
    it('should return a CreateCategoryDomainOptions object with the correct properties', () => {
      const command = new CreateCategoryCommand({
        name: 'Test Category',
        description: 'Test Description',
        parentIds: ['1'],
        subCategoryIds: ['2', '3'],
        productIds: ['4', '5'],
      });
      const domain: CreateCategoryDomainOptions = {
        name: new CategoryNameValueObject(command.name),
        description: new CategoryDescriptionValueObject(command.description),
        parentIds: command.parentIds.map(
          (id) => new ParentCategoryIdValueObject(id),
        ),
        subCategoryIds: command.subCategoryIds.map(
          (id) => new SubCategoryIdValueObject(id),
        ),
        productIds: command.productIds.map(
          (id) => new ProductIdValueObject(id),
        ),
      };

      const result = mapper.toDomain(command);

      expect(result).toEqual(domain);
    });
  });

  describe('toResponseDto', () => {
    it('should return a CreateCategoryResponseDto object with the correct properties', () => {
      const event = new CategoryCreatedDomainEvent({
        id: new CategoryIdValueObject('1'),
        details: {
          name: new CategoryNameValueObject('Test Category'),
          description: new CategoryDescriptionValueObject('Test Description'),
          parentIds: [new ParentCategoryIdValueObject('2')],
          subCategoryIds: [
            new SubCategoryIdValueObject('3'),
            new SubCategoryIdValueObject('4'),
          ],
          productIds: [
            new ProductIdValueObject('5'),
            new ProductIdValueObject('6'),
          ],
        },
      });
      const responseDto = new CreateCategoryResponseDto({
        id: event.entityId.unpack(),
        name: event.name.unpack(),
        description: event.description.unpack(),
        parentIds: event.parentIds.map((id) => id.unpack()),
        subCategoryIds: event.subCategoryIds.map((id) => id.unpack()),
        productIds: event.productIds.map((id) => id.unpack()),
      });

      const result = mapper.toResponseDto(event);

      expect(result).toEqual(responseDto);
    });
  });
});
