import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import {
  UseCaseCommandValidationExceptions,
  UseCaseProcessExceptions,
} from '@use-cases/common';
import { RejectProductHandler } from '@use-cases/reject-product';
import {
  RejectProductMapper,
  RejectProductProcess,
  RejectProductProcessFailure,
  RejectProductProcessSuccess,
  RejectProductRequestValidator,
} from '@use-cases/reject-product/application-services';
import {
  RejectProductRequestDto,
  RejectProductDomainOptions,
  RejectProductResponseDto,
} from '@use-cases/reject-product/dtos';
import { mock, MockProxy } from 'jest-mock-extended';
import { Err, Ok } from 'oxide.ts';

describe('RejectProductHandler', () => {
  let validator: MockProxy<RejectProductRequestValidator>;
  let rejectProductProcess: MockProxy<RejectProductProcess>;
  let mapper: MockProxy<RejectProductMapper>;
  let handler: RejectProductHandler;

  beforeEach(() => {
    validator = mock<RejectProductRequestValidator>();
    rejectProductProcess = mock<RejectProductProcess>();
    mapper = mock<RejectProductMapper>();
    handler = new RejectProductHandler(validator, mapper, rejectProductProcess);
  });

  it('should return validation error if command is invalid', async () => {
    const command = new RejectProductRequestDto({
      reviewerId: '',
      productId: '',
      reason: '',
    });
    validator.validate.mockReturnValue({
      isValid: false,
      exceptions: [
        new ProductDomainExceptions.IdDoesNotValid(),
        new ProductDomainExceptions.RejectionReasonDoesNotValid(),
        new ReviewerDomainExceptions.IdDoesNotValid(),
      ],
    });

    const result = await handler.execute(command);

    expect(result.isErr()).toBeTruthy();
    expect(result.unwrapErr()).toBeInstanceOf(
      UseCaseCommandValidationExceptions,
    );
  });

  it('should return process error if the rejectProductProcess fails', async () => {
    const command = mock<RejectProductRequestDto>();
    const domainOptions = mock<RejectProductDomainOptions>();
    const failResult = mock<Err<RejectProductProcessFailure>>();
    failResult.isErr.mockReturnValue(true);
    failResult.unwrapErr.mockReturnValue([
      new ProductDomainExceptions.DoesNotExist(),
    ]);

    validator.validate.mockReturnValue({ isValid: true, exceptions: [] });
    mapper.toDomain.mockReturnValue(domainOptions);
    rejectProductProcess.execute.mockResolvedValue(failResult);

    const result = await handler.execute(command);

    expect(result.isErr()).toBeTruthy();
    expect(result.unwrapErr()).toBeInstanceOf(UseCaseProcessExceptions);
  });

  it('should return success if the product is rejected successfully', async () => {
    const command = mock<RejectProductRequestDto>();
    const domainOptions = mock<RejectProductDomainOptions>();
    const successResult = mock<Ok<RejectProductProcessSuccess>>();
    const responseDto = mock<RejectProductResponseDto>();

    validator.validate.mockReturnValue({ isValid: true, exceptions: [] });
    mapper.toDomain.mockReturnValue(domainOptions);
    rejectProductProcess.execute.mockResolvedValue(successResult);
    mapper.toResponseDto.mockReturnValue(responseDto);

    const result = await handler.execute(command);

    expect(result.isOk()).toBeTruthy();
    expect(result.unwrap()).toEqual(responseDto);
  });
});
