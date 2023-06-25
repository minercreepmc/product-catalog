import { SubmitForApprovalRequestValidator } from '@use-cases/submit-for-approval/application-services';
import { SubmitForApprovalRequestDto } from '@use-cases/submit-for-approval/dtos';

describe('SubmitForApprovalCommandValidator', () => {
  let validator: SubmitForApprovalRequestValidator;

  beforeEach(() => {
    validator = new SubmitForApprovalRequestValidator();
  });

  describe('validate', () => {
    it('should return an array of validation exceptions when the command is invalid', () => {
      const command = new SubmitForApprovalRequestDto({
        reviewerId: '',
        productId: '',
      });
      const result = validator.validate(command);

      expect(result.isValid).toBeFalsy();
      expect(result.exceptions).toHaveLength(2);
    });

    it('should return an empty array of validation exceptions when the command is valid', () => {
      const command = new SubmitForApprovalRequestDto({
        reviewerId: '1',
        productId: '1',
      });

      const result = validator.validate(command);

      expect(result.isValid).toBeTruthy();
      expect(result.exceptions).toHaveLength(0);
    });
  });
});
