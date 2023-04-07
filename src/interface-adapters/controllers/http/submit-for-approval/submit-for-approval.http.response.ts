import { SubmitForApprovalResponseDto } from '@use-cases/submit-for-approval/dtos';

export class SubmitForApprovalHttpResponse
  implements SubmitForApprovalResponseDto
{
  productId: string;
  reviewerId: string;
  productStatus: string;
  message: string;

  constructor(dto: SubmitForApprovalResponseDto) {
    this.productId = dto.productId;
    this.reviewerId = dto.reviewerId;
    this.productStatus = dto.productStatus;
    this.message = dto.message;
  }
}
