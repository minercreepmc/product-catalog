import { SizeValueObject } from '@common-domain/value-objects';
import { ColorValueObject } from '@common-domain/value-objects/color';
import { WeightValueObject } from '@common-domain/value-objects/weight';
import { AbstractValueObject } from 'common-base-classes';

export interface ProductVariation {
  size?: SizeValueObject;
  weight?: WeightValueObject;
  color?: ColorValueObject;
}

export interface ProductAttributesDetails {
  variations: ProductVariation[];
}

export interface ProductAttributesOptions {
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

  get variations() {
    return this.details.variations;
  }

  addVariation(options: ProductVariationOptions) {
    const { size, color, weight } = options;
    const variation: ProductVariation = {};

    if (size) {
      const sizeVo = new SizeValueObject(size);
      variation.size = sizeVo;
    }
    if (color) {
      const colorVo = new ColorValueObject(color);
      variation.color = colorVo;
    }
    if (weight) {
      const weightVo = WeightValueObject.create({
        amount: weight.amount,
        unit: weight.unit,
      });
      variation.weight = weightVo;
    }
    this.variations.push(variation);
  }

  addVariations(variations: ProductVariationOptions[]) {
    const variationsDomain = variations.map((varitation) => {
      const { size, color, weight } = varitation;
      const variationDomain: ProductVariation = {};
      if (size) {
        const sizeVo = new SizeValueObject(size);
        variationDomain.size = sizeVo;
      }
      if (color) {
        const colorVo = new ColorValueObject(color);
        variationDomain.color = colorVo;
      }
      if (weight) {
        const weightVo = WeightValueObject.create({
          amount: weight.amount,
          unit: weight.unit,
        });
        variationDomain.weight = weightVo;
      }
      return variationDomain;
    });
    this.details.variations.push(...variationsDomain);
  }

  static create(
    options: ProductAttributesOptions,
  ): ProductAttributesValueObject {
    const { variations } = options;
    const productAttributes = new ProductAttributesValueObject();

    if (variations) {
      productAttributes.addVariations(options.variations);
    }

    return productAttributes;
  }
}
