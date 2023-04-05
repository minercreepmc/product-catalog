import {
  ProductAttributesValueObject,
  ProductVariationOptions,
} from '@value-objects/product';
import {
  ArgumentContainsEmptyStringException,
  ArgumentDoestNotIncludeInAllowedValues,
  ArgumentIsEmptyException,
} from 'common-base-classes';

describe('ProductAttributesValueObject', () => {
  describe('create', () => {
    it('should create a new ProductAttributesValueObject with variations', () => {
      const variations: ProductVariationOptions[] = [
        { size: 'XL', color: 'blue', weight: { amount: 100, unit: 'kg' } },
        { size: 'M', color: 'red', weight: { amount: 50, unit: 'kg' } },
      ];
      const productAttributes = ProductAttributesValueObject.create({
        variations,
      });
      expect(productAttributes.variations).toHaveLength(2);
      expect(productAttributes.variations[0].size?.unpack()).toBe('XL');
      expect(productAttributes.variations[0].color?.unpack()).toBe('blue');
      expect(productAttributes.variations[0].weight?.amount.unpack()).toBe(100);
      expect(productAttributes.variations[0].weight?.unit.unpack()).toBe('kg');
      expect(productAttributes.variations[1].size?.unpack()).toBe('M');
      expect(productAttributes.variations[1].color?.unpack()).toBe('red');
      expect(productAttributes.variations[1].weight?.amount.unpack()).toBe(50);
      expect(productAttributes.variations[1].weight?.unit.unpack()).toBe('kg');
    });

    it('should create a new ProductAttributesValueObject without variations', () => {
      const productAttributes = ProductAttributesValueObject.create();
      expect(productAttributes.variations).toHaveLength(0);
    });
  });

  describe('addVariation', () => {
    it('should add a new variation to the ProductAttributesValueObject', () => {
      const productAttributes = ProductAttributesValueObject.create();
      productAttributes.addVariation({
        size: 'XL',
        color: 'blue',
        weight: { amount: 100, unit: 'kg' },
      });
      expect(productAttributes.variations).toHaveLength(1);
      expect(productAttributes.variations[0].size?.unpack()).toBe('XL');
      expect(productAttributes.variations[0].color?.unpack()).toBe('blue');
      expect(productAttributes.variations[0].weight?.amount.unpack()).toBe(100);
      expect(productAttributes.variations[0].weight?.unit.unpack()).toBe('kg');
    });
  });

  describe('addVariations', () => {
    it('should add multiple variations to the ProductAttributesValueObject', () => {
      const productAttributes = ProductAttributesValueObject.create();
      productAttributes.addVariations([
        {
          size: 'XL',
          color: 'blue',
          weight: { amount: 100, unit: 'kg' },
        },
        {
          size: 'M',
          color: 'red',
          weight: { amount: 50, unit: 'kg' },
        },
      ]);
      expect(productAttributes.variations).toHaveLength(2);
      expect(productAttributes.variations[0].size?.unpack()).toBe('XL');
      expect(productAttributes.variations[0].color?.unpack()).toBe('blue');
      expect(productAttributes.variations[0].weight?.amount.unpack()).toBe(100);
      expect(productAttributes.variations[0].weight?.unit.unpack()).toBe('kg');
      expect(productAttributes.variations[1].size?.unpack()).toBe('M');
      expect(productAttributes.variations[1].color?.unpack()).toBe('red');
      expect(productAttributes.variations[1].weight?.amount.unpack()).toBe(50);
      expect(productAttributes.variations[1].weight?.unit.unpack()).toBe('kg');
    });
  });

  describe('removeVariation', () => {
    it('should remove a variation from the ProductAttributesValueObject', () => {
      const productAttributes = ProductAttributesValueObject.create({
        variations: [
          {
            size: 'XL',
            color: 'blue',
            weight: { amount: 100, unit: 'kg' },
          },
          {
            size: 'M',
            color: 'red',
            weight: { amount: 50, unit: 'kg' },
          },
        ],
      });
      expect(productAttributes.variations).toHaveLength(2);
      productAttributes.removeVariation(0);
      expect(productAttributes.variations).toHaveLength(1);
      expect(productAttributes.variations[0].size?.unpack()).toBe('M');
      expect(productAttributes.variations[0].color?.unpack()).toBe('red');
      expect(productAttributes.variations[0].weight?.amount.unpack()).toBe(50);
      expect(productAttributes.variations[0].weight?.unit.unpack()).toBe('kg');
    });
  });

  describe('validate', () => {
    it('should return a successful validation response when variations are valid', () => {
      const variations: ProductVariationOptions[] = [
        { size: 'L', color: 'red', weight: { amount: 100, unit: 'kg' } },
        { size: 'M', color: 'blue', weight: { amount: 50, unit: 'g' } },
      ];
      const validationResponse = ProductAttributesValueObject.validate({
        variations,
      });
      expect(validationResponse.isValid).toBe(true);
      expect(validationResponse.exceptions).toHaveLength(0);
    });

    it('should return a failed validation response when variations are empty', () => {
      const validationResponse = ProductAttributesValueObject.validate({});
      expect(validationResponse.isValid).toBe(false);
      expect(validationResponse.exceptions).toHaveLength(1);
      expect(validationResponse.exceptions).toIncludeAllMembers([
        new ArgumentIsEmptyException(),
      ]);
    });

    it('should return a failed validation response when variations are invalid', () => {
      const variations: ProductVariationOptions[] = [
        { size: '', color: '', weight: { amount: 0, unit: '' } },
        { size: 'M', color: 'red', weight: { amount: 50, unit: 'kg' } },
      ];
      const validationResponse = ProductAttributesValueObject.validate({
        variations,
      });
      expect(validationResponse.isValid).toBe(false);
      expect(validationResponse.exceptions).toIncludeAllMembers([
        new ArgumentContainsEmptyStringException(),
      ]);
    });
  });

  describe('ProductAttributesValueObject', () => {
    describe('validateVariations', () => {
      it('should fail with ArgumentIsEmptyException if variations is not provided', () => {
        const response =
          ProductAttributesValueObject.validateVariations(undefined);
        expect(response.isValid).toBe(false);
        expect(response.exceptions).toIncludeAllMembers([
          new ArgumentIsEmptyException(),
        ]);
      });

      it('should fail with ArgumentIsEmptyException if variations is an empty array', () => {
        const response = ProductAttributesValueObject.validateVariations([]);
        expect(response.isValid).toBe(false);
        expect(response.exceptions).toIncludeAllMembers([
          new ArgumentIsEmptyException(),
        ]);
      });

      it('should fail with ValidationExceptionBase[] if any variation is invalid', () => {
        const variations = [
          {
            size: 'medium',
            color: '#FF0000',
            weight: { amount: 500, unit: 'g' },
          },
          { size: 'small', color: '', weight: { amount: 1, unit: 'kg' } },
        ];

        const response =
          ProductAttributesValueObject.validateVariations(variations);
        expect(response.isValid).toBe(false);
        expect(response.exceptions).toIncludeAllMembers([
          new ArgumentDoestNotIncludeInAllowedValues(),
          new ArgumentContainsEmptyStringException(),
        ]);
      });

      it('should pass with no exceptions if all variations are valid', () => {
        const variations = [
          {
            size: 'medium',
            color: 'white',
            weight: { amount: 500, unit: 'g' },
          },
          {
            size: 'small',
            color: 'red',
            weight: { amount: 1, unit: 'kg' },
          },
        ];

        const response =
          ProductAttributesValueObject.validateVariations(variations);
        expect(response.isValid).toBe(true);
        expect(response.exceptions).toHaveLength(0);
      });
    });
  });
});
