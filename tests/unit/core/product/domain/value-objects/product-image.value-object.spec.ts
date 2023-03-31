import { ProductImageValueObject } from '@product-domain/value-objects';

describe('ProductImageValueObject', () => {
  describe('validate()', () => {
    it('should return true when the input is a valid image URL', () => {
      const validUrl = 'https://example.com/image.jpg';

      const { isValid } = ProductImageValueObject.validate(validUrl);
      expect(isValid).toBe(true);
    });

    it('should return false when the input is an invalid image URL', () => {
      const invalidUrl = 'invalid-image-url';

      const { isValid } = ProductImageValueObject.validate(invalidUrl);
      expect(isValid).toBe(false);
    });

    it('should return true when the input is a valid image URL with query parameters', () => {
      const validUrlWithParams =
        'https://example.com/image.jpg?width=300&height=200';

      const { isValid } = ProductImageValueObject.validate(validUrlWithParams);
      expect(isValid).toBe(true);
    });

    it('should return false when the input is a URL without a scheme', () => {
      const urlWithoutScheme = 'example.com/image.jpg';

      const { isValid } = ProductImageValueObject.validate(urlWithoutScheme);
      expect(isValid).toBe(false);
    });
  });

  describe('constructor()', () => {
    it('should create an instance when provided with a valid image URL', () => {
      const validUrl = 'https://example.com/image.jpg';

      expect(() => new ProductImageValueObject(validUrl)).not.toThrow();
    });

    it('should throw an exception when provided with an invalid image URL', () => {
      const invalidUrl = 'invalid-image-url';

      expect(() => new ProductImageValueObject(invalidUrl)).toThrow();
    });
  });
});
