import { CategoryDomainExceptions } from '@domain-exceptions/category';
import { AddParentCategoriesValidator } from '@use-cases/add-parent-categories/application-services';
import { AddParentCategoriesCommand } from '@use-cases/add-parent-categories/dtos';

describe('AddParentCategoriesValidator', () => {
  let validator: AddParentCategoriesValidator;

  beforeEach(() => {
    validator = new AddParentCategoriesValidator();
  });

  describe('validate', () => {
    it('should return a success validation response when the command is valid', () => {
      const command = new AddParentCategoriesCommand({
        categoryId: 'ValidCategoryId',
        parentIds: ['ValidParentCategoryId1', 'ValidParentCategoryId2'],
      });
      const validationResult = validator.validate(command);
      expect(validationResult.isValid).toBe(true);
    });

    it('should return a failed validation response when the command is invalid', () => {
      const command = new AddParentCategoriesCommand({
        categoryId: '',
        parentIds: [''],
      });
      const validationResult = validator.validate(command);
      expect(validationResult.isValid).toBe(false);
      expect(validationResult.exceptions).toIncludeAllMembers([
        new CategoryDomainExceptions.IdDoesNotValid(),
        new CategoryDomainExceptions.ParentIdDoesNotValid(),
      ]);
    });

    it('should clear exceptions after multiple calls to validate', () => {
      const validCategoryId = 'ValidCategoryId';
      const invalidCategoryId = '';
      const validParentCategoryIds = [
        'ValidParentCategoryId1',
        'ValidParentCategoryId2',
      ];
      const invalidParentCategoryIds = [''];

      // First call with invalid input
      const command1 = new AddParentCategoriesCommand({
        categoryId: invalidCategoryId,
        parentIds: invalidParentCategoryIds,
      });
      const validationResult1 = validator.validate(command1);
      expect(validationResult1.isValid).toBe(false);
      expect(validationResult1.exceptions.length).toBeGreaterThan(0);

      // Second call with valid input
      const command2 = new AddParentCategoriesCommand({
        categoryId: validCategoryId,
        parentIds: validParentCategoryIds,
      });
      const validationResult2 = validator.validate(command2);
      expect(validationResult2.isValid).toBe(true);
      expect(validationResult2.exceptions.length).toBe(0);
    });
  });
});
