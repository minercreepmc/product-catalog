import { CreateReviewerResponseDto } from '@use-cases/create-reviewer/dtos';

export class CreateReviewerHttpResponse implements CreateReviewerResponseDto {
  readonly reviewerId: string;
  readonly name: string;
  readonly email: string;
  readonly role: string;
  readonly message: string;

  constructor(options: CreateReviewerHttpResponse) {
    const { reviewerId, name, email, role, message } = options;
    this.reviewerId = reviewerId;
    this.name = name;
    this.email = email;
    this.role = role;
    this.message = message;
  }
}
