import { SizeValueObject } from '@value-objects/common';
import { ColorValueObject } from '@value-objects/common/color';
import { WeightValueObject } from '@value-objects/common/weight';
import {
  AbstractValueObject,
  ArgumentIsEmptyException,
  ValidationExceptionBase,
  ValidationResponse,
} from 'common-base-classes';

export interface ProductVariation {
  size?: SizeValueObject;
  weight?: WeightValueObject;
  color?: ColorValueObject;
}

export interface ProductAttributesDetails {
  variations: ProductVariation[];
}

export interface CreateProductAttributesOptions {
  variations?: {
    size?: string;
    weight?: {
      amount: number;
      unit: string;
    };
    color?: string;
  }[];
}

export interface ProductVariationOptions {
  size?: string;
  weight?: {
    amount: number;
    unit: string;
  };
  color?: string;
}

export class ProductAttributesValueObject extends AbstractValueObject<
  Partial<ProductAttributesDetails>
> {
  constructor(details?: ProductAttributesDetails) {
    super(
      details
        ? details
        : {
            variations: [],
          },
    );
  }

  static validate(options: {
    variations?: ProductVariationOptions[];
  }): ValidationResponse {
    const { variations } = options || {};
    const exceptions: ValidationExceptionBase[] = [];

    const variationValidated = this.validateVariations(variations);

    if (!variationValidated.isValid) {
      exceptions.push(...variationValidated.exceptions);
    }

    return exceptions.length > 0
      ? ValidationResponse.fail(exceptions)
      : ValidationResponse.success();
  }

  static validateVariations(
    variations: ProductVariationOptions[],
  ): ValidationResponse {
    if (!variations || variations.length === 0) {
      return ValidationResponse.fail([new ArgumentIsEmptyException()]);
    }
    const exceptions: ValidationExceptionBase[] = [];

    for (const variation of variations) {
      const { size, color, weight } = variation || {};

      if (size !== undefined) {
        const sizeRes = SizeValueObject.validate(size);
        if (!sizeRes.isValid) {
          exceptions.push(...sizeRes.exceptions);
        }
      }

      if (color !== undefined) {
        const colorRes = ColorValueObject.validate(color);
        if (!colorRes.isValid) {
          exceptions.push(...colorRes.exceptions);
        }
      }

      if (weight !== undefined) {
        const weightRes = WeightValueObject.validate(weight);
        if (!weightRes.isValid) {
          exceptions.push(...weightRes.exceptions);
        }
      }
    }

    return exceptions.length > 0
      ? ValidationResponse.fail(exceptions)
      : ValidationResponse.success();
  }

  get variations() {
    return this.details.variations;
  }

  addVariation(options: ProductVariationOptions) {
    this.details.variations.push(
      ProductAttributesValueObject.createProductVariation(options),
    );
    return this;
  }

  addVariations(variations: ProductVariationOptions[]) {
    const newVariations = variations.map((v) =>
      ProductAttributesValueObject.createProductVariation(v),
    );
    this.details.variations.push(...newVariations);
    return this;
  }

  removeVariation(index: number) {
    this.details.variations.splice(index, 1);
    return this;
  }

  static create(options?: {
    variations?: ProductVariationOptions[];
  }): ProductAttributesValueObject {
    const { variations } = options ?? {};

    return new ProductAttributesValueObject({
      variations: (variations ?? []).map((v) =>
        ProductAttributesValueObject.createProductVariation(v),
      ),
    });
  }

  private static createProductVariation(options: ProductVariationOptions) {
    const { size, color, weight } = options ?? {};
    const variation: ProductVariation = {};

    if (size) {
      variation.size = new SizeValueObject(size);
    }

    if (color) {
      variation.color = new ColorValueObject(color);
    }

    if (weight) {
      variation.weight = WeightValueObject.create({
        amount: weight.amount,
        unit: weight.unit,
      });
    }

    return variation;
  }
}
