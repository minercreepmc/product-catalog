export class CreateReviewerResponseDto {
  readonly reviewerId: string;
  readonly name: string;
  readonly email: string;
  constructor(dtos: CreateReviewerResponseDto) {
    this.reviewerId = dtos.reviewerId;
    this.name = dtos.name;
    this.email = dtos.email;
  }
}
