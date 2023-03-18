import { ColorValueObject } from '@common-domain/value-objects/color';
import {
  ArgumentContainsNumberException,
  ArgumentContainsUppercaseException,
  ArgumentContainsWhitespaceException,
  MultipleExceptions,
} from 'common-base-classes';

describe('ColorValueObject', () => {
  it('should create a ColorValueObject with a valid color', () => {
    const color = 'blue';
    const colorValueObject = new ColorValueObject(color);
    expect(colorValueObject.unpack()).toBe(color);
  });

  it('should create a ColorValueObject with a valid multiple-word color', () => {
    const color = 'steel-blue';
    const colorValueObject = new ColorValueObject(color);
    expect(colorValueObject.unpack()).toBe(color);
  });

  it('should throw an exception for an invalid color', () => {
    const color = 'not-a-color';
    expect(() => new ColorValueObject(color)).toThrow();
  });

  it('should throw an exception for a color with uppercase letters', () => {
    const color = 'Blue';
    try {
      new ColorValueObject(color);
    } catch (e) {
      expect(e).toBeInstanceOf(MultipleExceptions);
      const typedExceptions = e as MultipleExceptions;
      expect(typedExceptions.exceptions).toEqual(
        expect.arrayContaining([new ArgumentContainsUppercaseException()]),
      );
    }
    expect(() => new ColorValueObject(color)).toThrow();
  });

  it('should throw an exception for a color with whitespace', () => {
    const color = 'light blue';
    try {
      new ColorValueObject(color);
    } catch (e) {
      expect(e).toBeInstanceOf(MultipleExceptions);
      const typedExceptions = e as MultipleExceptions;
      expect(typedExceptions.exceptions).toEqual(
        expect.arrayContaining([new ArgumentContainsWhitespaceException()]),
      );
    }
  });

  it('should throw an exception for a color with numbers', () => {
    const color = 'blue123';
    try {
      new ColorValueObject(color);
    } catch (e) {
      expect(e).toBeInstanceOf(MultipleExceptions);
      const typedExceptions = e as MultipleExceptions;
      expect(typedExceptions.exceptions).toEqual(
        expect.arrayContaining([new ArgumentContainsNumberException()]),
      );
    }
  });

  it('should throw an exception for an empty color', () => {
    const color = '';
    try {
      new ColorValueObject(color);
    } catch (e) {
      expect(e).toBeInstanceOf(MultipleExceptions);
      const typedExceptions = e as MultipleExceptions;
      expect(typedExceptions.exceptions).toEqual(
        expect.arrayContaining([new ArgumentContainsWhitespaceException()]),
      );
    }
  });
});
