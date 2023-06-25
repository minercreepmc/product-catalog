import { RequestDtoBase } from '@base/use-cases';
import { V1RegisterMemberRequestDto } from '@shared/gateways/register-member.interface';
import { ReviewerRoleEnum } from '@value-objects/reviewer';
import { CreateReviewerRequestDto } from '../dtos';

export type CreateReviewerSagaRequestDtoOptions = Pick<
  CreateReviewerSagaRequestDto,
  'username' | 'email' | 'name' | 'role' | 'password'
>;

export class CreateReviewerSagaRequestDto extends RequestDtoBase<CreateReviewerSagaResponseDto> {
  readonly username: string;
  readonly email: string;
  readonly name: string;
  readonly role: ReviewerRoleEnum;
  readonly password: string;
  constructor(dto: CreateReviewerSagaRequestDtoOptions) {
    super();
    Object.assign(this, dto);
  }

  makeCreateReviewerRequestDto(): CreateReviewerRequestDto {
    return new CreateReviewerRequestDto({
      name: this.name,
      role: this.role,
    });
  }

  makeRegisterMemberRequestDto(): V1RegisterMemberRequestDto {
    return {
      username: this.username,
      email: this.email,
      password: this.password,
    };
  }
}

export class CreateReviewerSagaResponseDto extends RequestDtoBase<any> {
  readonly reviewerId: string;
  readonly name: string;
  readonly role: string;
  constructor(dto: CreateReviewerSagaResponseDto) {
    super();
    this.reviewerId = dto.reviewerId;
    this.name = dto.name;
    this.role = dto.role;
  }
}
