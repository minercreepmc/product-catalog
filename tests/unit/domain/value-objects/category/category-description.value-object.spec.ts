import { CategoryDescriptionValueObject } from '@value-objects/category';

describe('CategoryDescriptionValueObject', () => {
  it('should accept a valid category description', () => {
    const description = 'This is a category for electronic devices.';
    const categoryDescription = new CategoryDescriptionValueObject(description);
    expect(categoryDescription.unpack()).toBe(description);
  });

  it('should throw an error when the category description is too short', () => {
    const description = 'A123';
    expect(() => new CategoryDescriptionValueObject(description)).toThrow();
  });

  it('should throw an error when the category description is too long', () => {
    const description = 'A'.repeat(101);
    expect(() => new CategoryDescriptionValueObject(description)).toThrow();
  });

  it('should throw an error when the category description is empty', () => {
    const description = '';
    expect(() => new CategoryDescriptionValueObject(description)).toThrow();
  });
});
