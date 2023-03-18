import {
  CategoryIdValueObject,
  CategoryPathValueObject,
  CategoryPathValueObjectDetails,
} from '@category-domain/value-objects';

describe('CategoryPathValueObject', () => {
  const validCategoryId1 = new CategoryIdValueObject();
  const validCategoryId2 = new CategoryIdValueObject();

  it('should create a CategoryPathValueObject with valid CategoryIdValueObject instances', () => {
    const categoryPathDetails = {
      categoryIds: [validCategoryId1, validCategoryId2],
    };

    const categoryPathValueObject = new CategoryPathValueObject(
      categoryPathDetails,
    );
    expect(categoryPathValueObject.categoryIds).toEqual([
      validCategoryId1,
      validCategoryId2,
    ]);
  });

  it('should throw an error when creating a CategoryPathValueObject with an invalid list of CategoryIdValueObject', () => {
    const invalidCategoryIds = [
      'invalid-category-id-1',
      'invalid-category-id-2',
    ];
    const categoryPathDetails = {
      categoryIds: invalidCategoryIds,
    };

    expect(
      () =>
        new CategoryPathValueObject(
          categoryPathDetails as unknown as CategoryPathValueObjectDetails,
        ),
    ).toThrowError('Invalid categoryIds provided');
  });
});
