import { ApiProperty } from '@nestjs/swagger';
import { SubmitForApprovalCommand } from '@use-cases/submit-for-approval/dtos';

export class SubmitForApprovalHttpRequest implements SubmitForApprovalCommand {
  @ApiProperty({
    description: 'ID of the product',
    example: '1',
  })
  productId: string;

  @ApiProperty({
    description: 'ID of the reviewer',
    example: '1',
  })
  reviewerId: string;
}
