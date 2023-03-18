import type { WeightAmountValueObject } from './weight-amount.value-object';
import type { WeightUnitValueObject } from './weight-unit.value-object';

export interface WeightValueObjectDetails {
  amount: WeightAmountValueObject;
  unit: WeightUnitValueObject;
}

export enum WeightUnit {
  Kilograms = 'kg',
  Pounds = 'lbs',
  Ounces = 'oz',
  Grams = 'g',
}

export interface WeightValueObjectOptions {
  amount: number;
  unit: string;
}
