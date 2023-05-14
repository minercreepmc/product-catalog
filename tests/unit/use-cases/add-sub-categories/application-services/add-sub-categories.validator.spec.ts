import { CategoryDomainExceptions } from '@domain-exceptions/category';
import { AddSubCategoriesValidator } from '@use-cases/add-sub-categories/application-services';
import { AddSubCategoriesCommand } from '@use-cases/add-sub-categories/dtos';

describe('AddSubCategoriesValidator', () => {
  let validator: AddSubCategoriesValidator;

  beforeEach(() => {
    validator = new AddSubCategoriesValidator();
  });

  describe('validate', () => {
    it('should return a success validation response when the command is valid', () => {
      const command = new AddSubCategoriesCommand({
        categoryId: 'ValidCategoryId',
        subCategoryIds: ['ValidSubCategoryId1', 'ValidSubCategoryId2'],
      });
      const validationResult = validator.validate(command);
      expect(validationResult.isValid).toBe(true);
    });

    it('should return a failed validation response when the command is invalid', () => {
      const command = new AddSubCategoriesCommand({
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
      const command1 = new AddSubCategoriesCommand({
        categoryId: invalidCategoryId,
        subCategoryIds: invalidSubCategoryIds,
      });
      const validationResult1 = validator.validate(command1);
      expect(validationResult1.isValid).toBe(false);
      expect(validationResult1.exceptions.length).toBeGreaterThan(0);

      // Second call with valid input
      const command2 = new AddSubCategoriesCommand({
        categoryId: validCategoryId,
        subCategoryIds: validSubCategoryIds,
      });
      const validationResult2 = validator.validate(command2);
      expect(validationResult2.isValid).toBe(true);
      expect(validationResult2.exceptions.length).toBe(0);
    });
  });
});
