import { ReviewerEmailValueObject } from '@reviewer-domain/value-objects/reviewer-email';

describe('ReviewerEmailValueObject', () => {
  describe('constructor', () => {
    it('should create a new instance of ReviewerEmailValueObject', () => {
      const email = new ReviewerEmailValueObject('test@example.com');
      expect(email).toBeInstanceOf(ReviewerEmailValueObject);
    });
  });

  describe('validate', () => {
    it('should return a valid response for a valid email', () => {
      const response = ReviewerEmailValueObject.validate('test@example.com');
      expect(response.isValid).toBe(true);
    });

    it('should return an invalid response for an email with invalid characters', () => {
      const response = ReviewerEmailValueObject.validate('test!example.com');
      expect(response.isValid).toBe(false);
    });

    it('should return an invalid response for an email with too few characters', () => {
      const response = ReviewerEmailValueObject.validate('a@b.c');
      expect(response.isValid).toBe(false);
    });

    it('should return an invalid response for an email with too many characters', () => {
      const response = ReviewerEmailValueObject.validate(
        'test@example.com'.repeat(10),
      );
      expect(response.isValid).toBe(false);
    });
  });
});
