import {
  ProductAttributesValueObject,
  ProductVariationOptions,
} from '@product-domain/value-objects';

describe('ProductAttributesValueObject', () => {
  const productVariations: ProductVariationOptions[] = [
    {
      size: 'M',
      color: 'red',
      weight: {
        amount: 500,
        unit: 'g',
      },
    },
    {
      size: 'L',
      color: 'blue',
      weight: {
        amount: 700,
        unit: 'g',
      },
    },
  ];
  it('should create a ProductAttributesValueObject with multiple variations', () => {
    const productAttributesValueObject =
      ProductAttributesValueObject.createMultiple(productVariations);

    expect(productAttributesValueObject.variations.length).toBe(2);
  });

  it('should create a ProductAttributesValueObject with a single variation', () => {
    const singleVariationOptions = productVariations[0];
    const productAttributesValueObject =
      ProductAttributesValueObject.createSingle(singleVariationOptions);

    expect(productAttributesValueObject.variations.length).toBe(1);
  });

  it('should have correct values in variations', () => {
    const productAttributesValueObject =
      ProductAttributesValueObject.createMultiple(productVariations);

    productAttributesValueObject.variations.forEach((variation, index) => {
      const options = productVariations[index];
      expect(variation.size?.unpack()).toBe(options.size);
      expect(variation.color?.unpack()).toBe(options.color);
      expect(variation.weight?.amount.unpack()).toBe(options.weight?.amount);
      expect(variation.weight?.unit.unpack()).toBe(options.weight?.unit);
    });
  });
});
