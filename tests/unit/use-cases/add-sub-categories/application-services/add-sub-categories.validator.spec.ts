import { CategoryDomainExceptions } from '@domain-exceptions/category';
import { AddSubCategoriesRequestValidator } from '@use-cases/add-sub-categories/application-services';
import { AddSubCategoriesRequestDto } from '@use-cases/add-sub-categories/dtos';

describe('AddSubCategoriesValidator', () => {
  let validator: AddSubCategoriesRequestValidator;

  beforeEach(() => {
    validator = new AddSubCategoriesRequestValidator();
  });

  describe('validate', () => {
    it('should return a success validation response when the command is valid', () => {
      const command = new AddSubCategoriesRequestDto({
        categoryId: 'ValidCategoryId',
        subCategoryIds: ['ValidSubCategoryId1', 'ValidSubCategoryId2'],
      });
      const validationResult = validator.validate(command);
      expect(validationResult.isValid).toBe(true);
    });

    it('should return a failed validation response when the command is invalid', () => {
      const command = new AddSubCategoriesRequestDto({
        categoryId: '',
        subCategoryIds: [''],
      });
      const validationResult = validator.validate(command);
      expect(validationResult.isValid).toBe(false);
      expect(validationResult.exceptions).toIncludeAllMembers([
        new CategoryDomainExceptions.IdDoesNotValid(),
        new CategoryDomainExceptions.SubCategoryIdsDoesNotValid(),
      ]);
    });

    it('should clear exceptions after multiple calls to validate', () => {
      const validCategoryId = 'ValidCategoryId';
      const invalidCategoryId = '';
      const validSubCategoryIds = [
        'ValidSubCategoryId1',
        'ValidSubCategoryId2',
      ];
      const invalidSubCategoryIds = [''];

      // First call with invalid input
      const command1 = new AddSubCategoriesRequestDto({
        categoryId: invalidCategoryId,
        subCategoryIds: invalidSubCategoryIds,
      });
      const validationResult1 = validator.validate(command1);
      expect(validationResult1.isValid).toBe(false);
      expect(validationResult1.exceptions.length).toBeGreaterThan(0);

      // Second call with valid input
      const command2 = new AddSubCategoriesRequestDto({
        categoryId: validCategoryId,
        subCategoryIds: validSubCategoryIds,
      });
      const validationResult2 = validator.validate(command2);
      expect(validationResult2.isValid).toBe(true);
      expect(validationResult2.exceptions.length).toBe(0);
    });
  });
});
