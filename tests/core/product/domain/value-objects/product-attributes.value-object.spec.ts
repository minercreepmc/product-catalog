import { SizeValueObject } from '@common-domain/value-objects';
import { ColorValueObject } from '@common-domain/value-objects/color';
import { WeightValueObject } from '@common-domain/value-objects/weight';
import {
  ProductAttributesValueObject,
  ProductVariationOptions,
} from '@product-domain/value-objects';

describe('ProductAttributesValueObject', () => {
  let productAttributes: ProductAttributesValueObject;

  beforeEach(() => {
    productAttributes = new ProductAttributesValueObject();
  });

  test('should create an empty product attributes value object', () => {
    expect(productAttributes.variations).toEqual([]);
  });

  test('should add a single variation', () => {
    const variation: ProductVariationOptions = {
      size: 'M',
      color: 'blue',
      weight: {
        amount: 500,
        unit: 'g',
      },
    };

    productAttributes.addVariation(variation);

    expect(productAttributes.variations).toHaveLength(1);
    expect(productAttributes.variations[0].size).toBeInstanceOf(
      SizeValueObject,
    );
    expect(productAttributes.variations[0].color).toBeInstanceOf(
      ColorValueObject,
    );
    expect(productAttributes.variations[0].weight).toBeInstanceOf(
      WeightValueObject,
    );
  });

  test('should add multiple variations', () => {
    const variations: ProductVariationOptions[] = [
      {
        size: 'M',
        color: 'blue',
        weight: {
          amount: 500,
          unit: 'g',
        },
      },
      {
        size: 'L',
        color: 'red',
        weight: {
          amount: 600,
          unit: 'g',
        },
      },
    ];

    productAttributes.addVariations(variations);

    expect(productAttributes.variations).toHaveLength(2);
    expect(productAttributes.variations[0].size).toBeInstanceOf(
      SizeValueObject,
    );
    expect(productAttributes.variations[0].color).toBeInstanceOf(
      ColorValueObject,
    );
    expect(productAttributes.variations[0].weight).toBeInstanceOf(
      WeightValueObject,
    );
    expect(productAttributes.variations[1].size).toBeInstanceOf(
      SizeValueObject,
    );
    expect(productAttributes.variations[1].color).toBeInstanceOf(
      ColorValueObject,
    );
    expect(productAttributes.variations[1].weight).toBeInstanceOf(
      WeightValueObject,
    );
  });

  describe('create', () => {
    it('should create a product attributes value object with create static methods', () => {
      const attributes = ProductAttributesValueObject.create({
        variations: [
          {
            size: 'M',
            color: 'blue',
            weight: {
              amount: 500,
              unit: 'g',
            },
          },
        ],
      });

      expect(attributes).toBeInstanceOf(ProductAttributesValueObject);
      expect(attributes.variations).toHaveLength(1);
    });
  });
});
