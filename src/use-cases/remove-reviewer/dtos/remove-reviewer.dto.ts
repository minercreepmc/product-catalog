import { RequestDtoBase, ResponseDtoBase } from '@base/use-cases';

export type RemoveReviewerRequestDtoOptions = Pick<
  RemoveReviewerRequestDto,
  'id'
>;

export type RemoveReviewerResponseDtoOptions = Pick<
  RemoveReviewerResponseDto,
  'id'
>;

export class RemoveReviewerRequestDto extends RequestDtoBase<RemoveReviewerResponseDto> {
  id: string;
  constructor(options: RemoveReviewerRequestDtoOptions) {
    super();
    Object.assign(this, options);
  }
}

export class RemoveReviewerResponseDto extends ResponseDtoBase {
  id: string;

  constructor(options: RemoveReviewerResponseDto) {
    super();
    Object.assign(this, options);
  }
}
