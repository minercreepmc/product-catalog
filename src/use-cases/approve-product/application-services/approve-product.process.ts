import { CompositeBusinessRulesEnforcer, ProcessBase } from '@base/use-cases';
import { ApproveProductCommand } from '@commands';
import { ProductApprovedDomainEvent } from '@domain-events/product';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import { ProductApprovalDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import {
  ProductBusinessEnforcer,
  ReviewerBusinessEnforcer,
} from '@use-cases/application-services/process';

export type ApproveProductProcessSucess = ProductApprovedDomainEvent;

type ProductFailure = Array<
  | ProductDomainExceptions.DoesNotExist
  | ProductDomainExceptions.NotSubmittedForApproval
>;
type ReviewerFailure = Array<
  ReviewerDomainExceptions.DoesNotExist | ReviewerDomainExceptions.NotAuthorized
>;
export type ApproveProductProcessFailure = ProductFailure | ReviewerFailure;

@Injectable()
export class ApproveProductProcess extends ProcessBase<
  ApproveProductProcessSucess,
  ApproveProductProcessFailure
> {
  protected async enforceBusinessRules(
    command: ApproveProductCommand,
  ): Promise<void> {
    const { reviewerId, productId } = command;

    await this.productBusinessEnforcer.productIdMustExist(productId);
    await this.reviewerBusinessEnforcer.reviewerIdMustExist(reviewerId);

    if (super.hasNoExceptions()) {
      this.reviewerBusinessEnforcer.reviewerMustBeAdmin();
      this.productBusinessEnforcer.productMustBeSubmittedForApproval();
    }
  }
  protected executeMainTask(
    command: ApproveProductCommand,
  ): Promise<ProductApprovedDomainEvent> {
    return this.productApprovalService.approveProduct(command);
  }

  constructor(
    private readonly productApprovalService: ProductApprovalDomainService,
    private readonly productBusinessEnforcer: ProductBusinessEnforcer<ProductFailure>,
    private readonly reviewerBusinessEnforcer: ReviewerBusinessEnforcer<ReviewerFailure>,
  ) {
    const composite = new CompositeBusinessRulesEnforcer();
    composite.addEnforcer(productBusinessEnforcer);
    composite.addEnforcer(reviewerBusinessEnforcer);
    super({
      compositeBusinessEnforcer: composite,
    });
  }
}
