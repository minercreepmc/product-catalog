import { CategoryNameValueObject } from '@category-domain/value-objects';

describe('CategoryNameValueObject', () => {
  it('should accept a valid category name', () => {
    const name = 'Electronics';
    const categoryName = new CategoryNameValueObject(name);
    expect(categoryName.unpack()).toBe(name);
  });

  it('should throw an error when the category name is too short', () => {
    const name = 'A';
    expect(() => new CategoryNameValueObject(name)).toThrow();
  });

  it('should throw an error when the category name is too long', () => {
    const name = 'A'.repeat(51);
    expect(() => new CategoryNameValueObject(name)).toThrow();
  });

  it('should throw an error when the category name is empty', () => {
    const name = '';
    expect(() => new CategoryNameValueObject(name)).toThrow();
  });
});
