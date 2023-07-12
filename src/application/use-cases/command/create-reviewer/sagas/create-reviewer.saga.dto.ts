import { RequestDtoBase, ResponseDtoBase } from '@base/use-cases';
import { V1RegisterMemberRequestDto } from '@shared/proxies/handlers';
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

export class CreateReviewerSagaResponseDto extends ResponseDtoBase {
  readonly id: string;
  readonly name: string;
  readonly username: string;
  readonly email: string;
  readonly role: string;
  constructor(dto: CreateReviewerSagaResponseDto) {
    super();
    this.id = dto.id;
    this.name = dto.name;
    this.username = dto.username;
    this.email = dto.email;
    this.role = dto.role;
  }
}
