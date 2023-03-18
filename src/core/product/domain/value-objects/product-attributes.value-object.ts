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

export interface ProductVariationOptions {
  size?: string;
  weight?: {
    amount: number;
    unit: string;
  };
  color?: string;
}

export class ProductAttributesValueObject extends AbstractValueObject<ProductAttributesDetails> {
  constructor(details: ProductAttributesDetails) {
    super(details);
  }

  get variations() {
    return this.details.variations;
  }

  static createSingle(options: ProductVariationOptions) {
    const { size, color, weight } = options;
    const variations: ProductVariation[] = [];
    const variation: ProductVariation = {};
    variations.push(variation);
    const productAttributesDetails: ProductAttributesDetails = {
      variations,
    };

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
    return new ProductAttributesValueObject(productAttributesDetails);
  }

  static createMultiple(variations: ProductVariationOptions[]) {
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
    const attributeDetails: ProductAttributesDetails = {
      variations: variationsDomain,
    };

    return new ProductAttributesValueObject(attributeDetails);
  }
}
