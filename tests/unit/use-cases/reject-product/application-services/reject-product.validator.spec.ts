import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import { RejectProductValidator } from '@use-cases/reject-product/application-services';
import { RejectProductCommand } from '@use-cases/reject-product/dtos';

describe('RejectProductValidator', () => {
  let rejectProductValidator: RejectProductValidator;

  beforeEach(() => {
    rejectProductValidator = new RejectProductValidator();
  });

  it('should validate a valid command', () => {
    const command = new RejectProductCommand({
      reviewerId: 'valid-reviewer-id',
      productId: 'valid-product-id',
      reason: 'This product does not meet our requirements.',
    });

    const result = rejectProductValidator.validate(command);
    expect(result.isValid).toBe(true);
  });

  it('should return an error for invalid reviewerId', () => {
    const command = new RejectProductCommand({
      reviewerId: '',
      productId: 'valid-product-id',
      reason: 'This product does not meet our requirements.',
    });

    const result = rejectProductValidator.validate(command);
    expect(result.isValid).toBe(false);
    expect(result.exceptions).toIncludeAllMembers([
      new ReviewerDomainExceptions.IdDoesNotValid(),
    ]);
  });

  it('should return an error for invalid productId', () => {
    const command = new RejectProductCommand({
      reviewerId: 'valid-reviewer-id',
      productId: '',
      reason: 'This product does not meet our requirements.',
    });

    const result = rejectProductValidator.validate(command);
    expect(result.isValid).toBe(false);
    expect(result.exceptions).toIncludeAllMembers([
      new ProductDomainExceptions.IdDoesNotValid(),
    ]);
  });

  it('should return an error for invalid reason', () => {
    const command = new RejectProductCommand({
      reviewerId: 'valid-reviewer-id',
      productId: 'valid-product-id',
      reason: 'Bad', // Assume this reason does not pass the validation defined in RejectionReasonValueObject
    });

    const result = rejectProductValidator.validate(command);
    expect(result.isValid).toBe(false);
    expect(result.exceptions).toIncludeAllMembers([
      new ProductDomainExceptions.RejectionReasonDoesNotValid(),
    ]);
  });

  it('should return multiple errors for multiple invalid fields', () => {
    const command = new RejectProductCommand({
      reviewerId: '',
      productId: '',
      reason: 'Bad', // Assume this reason does not pass the validation defined in RejectionReasonValueObject
    });

    const result = rejectProductValidator.validate(command);
    expect(result.isValid).toBe(false);
    expect(result.exceptions).toIncludeAllMembers([
      new ReviewerDomainExceptions.IdDoesNotValid(),
      new ProductDomainExceptions.IdDoesNotValid(),
      new ProductDomainExceptions.RejectionReasonDoesNotValid(),
    ]);
  });
});
