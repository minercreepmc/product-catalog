import { RequestDtoBase, ResponseDtoBase } from '@base/use-cases';

export class CreateReviewerRequestDto extends RequestDtoBase<CreateReviewerResponseDto> {
  readonly name: string;
  readonly email: string;
  readonly role: string;
  constructor(dtos: Omit<CreateReviewerRequestDto, 'returnType'>) {
    super();
    this.name = dtos.name;
    this.email = dtos.email;
    this.role = dtos.role;
  }
}

export class CreateReviewerResponseDto extends ResponseDtoBase {
  readonly reviewerId: string;
  readonly name: string;
  readonly email: string;
  readonly role: string;
  constructor(dtos: Omit<CreateReviewerResponseDto, 'message'>) {
    super('Reviewer created successfully');
    this.reviewerId = dtos.reviewerId;
    this.name = dtos.name;
    this.email = dtos.email;
    this.role = dtos.role;
  }
}
