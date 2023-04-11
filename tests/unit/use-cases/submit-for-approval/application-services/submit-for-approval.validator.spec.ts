import { SubmitForApprovalValidator } from '@use-cases/submit-for-approval/application-services';
import { SubmitForApprovalCommand } from '@use-cases/submit-for-approval/dtos';

describe('SubmitForApprovalCommandValidator', () => {
  let validator: SubmitForApprovalValidator;

  beforeEach(() => {
    validator = new SubmitForApprovalValidator();
  });

  describe('validate', () => {
    it('should return an array of validation exceptions when the command is invalid', () => {
      const command = new SubmitForApprovalCommand({
        reviewerId: '',
        productId: '',
      });
      const result = validator.validate(command);

      expect(result.isValid).toBeFalsy();
      expect(result.exceptions).toHaveLength(2);
    });

    it('should return an empty array of validation exceptions when the command is valid', () => {
      const command = new SubmitForApprovalCommand({
        reviewerId: '1',
        productId: '1',
      });

      const result = validator.validate(command);

      expect(result.isValid).toBeTruthy();
      expect(result.exceptions).toHaveLength(0);
    });
  });
});
