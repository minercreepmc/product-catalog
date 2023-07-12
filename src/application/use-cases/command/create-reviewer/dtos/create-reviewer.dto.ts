import { RequestDtoBase, ResponseDtoBase } from '@base/use-cases';
import { ReviewerRoleEnum } from '@value-objects/reviewer';

export class CreateReviewerRequestDto extends RequestDtoBase<CreateReviewerResponseDto> {
  readonly name: string;
  readonly role: ReviewerRoleEnum;
  constructor(dtos: any) {
    super();
    this.name = dtos.name;
    this.role = dtos.role;
  }
}

export class CreateReviewerResponseDto extends ResponseDtoBase {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  constructor(dtos: CreateReviewerResponseDto) {
    super();
    this.id = dtos.id;
    this.name = dtos.name;
    this.role = dtos.role;
  }
}
