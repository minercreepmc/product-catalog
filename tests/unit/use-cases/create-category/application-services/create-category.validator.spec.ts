import { CategoryDomainExceptions } from '@domain-exceptions/category/category.domain-exception';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { CreateCategoryValidator } from '@use-cases/create-category/application-services';
import { CreateCategoryRequestDto } from '@use-cases/create-category/dtos';

describe('CreateCategoryValidator', () => {
  let validator: CreateCategoryValidator;

  beforeEach(() => {
    validator = new CreateCategoryValidator();
  });

  describe('validate', () => {
    it('should return a success validation response when the command is valid', () => {
      const command = new CreateCategoryRequestDto({
        name: 'Valid Name',
        description: 'Valid Description',
        parentIds: ['ValidParentId'],
        subCategoryIds: ['ValidSubCategoryId1', 'ValidSubCategoryId2'],
        productIds: ['ValidProductId1', 'ValidProductId2'],
      });
      const validationResult = validator.validate(command);
      expect(validationResult.isValid).toBe(true);
    });

    it('should return a failed validation response when the command is invalid', () => {
      const command = new CreateCategoryRequestDto({
        name: '',
        description: '',
        parentIds: [''],
        subCategoryIds: [''],
        productIds: [''],
      });
      const validationResult = validator.validate(command);
      expect(validationResult.isValid).toBe(false);
      expect(validationResult.exceptions).toIncludeAllMembers([
        new CategoryDomainExceptions.NameDoesNotValid(),
        new CategoryDomainExceptions.DescriptionDoesNotValid(),
        new CategoryDomainExceptions.ParentIdDoesNotValid(),
        new CategoryDomainExceptions.SubCategoryIdsDoesNotValid(),
        new ProductDomainExceptions.IdDoesNotValid(),
      ]);
    });

    it('should clear exceptions after multiple calls to validate', () => {
      const validName = 'Valid Name';
      const invalidName = '';
      const validDescription = 'Valid Description';
      const invalidDescription = '';

      // First call with invalid input
      const command1 = new CreateCategoryRequestDto({
        name: invalidName,
        description: invalidDescription,
      });
      const validationResult1 = validator.validate(command1);
      expect(validationResult1.isValid).toBe(false);
      expect(validationResult1.exceptions.length).toBeGreaterThan(0);

      // Second call with valid input
      const command2 = new CreateCategoryRequestDto({
        name: validName,
        description: validDescription,
      });
      const validationResult2 = validator.validate(command2);
      expect(validationResult2.isValid).toBe(true);
      expect(validationResult2.exceptions.length).toBe(0);
    });
  });
});
