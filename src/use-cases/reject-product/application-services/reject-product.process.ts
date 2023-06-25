import { CompositeBusinessRulesEnforcer, ProcessBase } from '@base/use-cases';
import { RejectProductCommand } from '@commands';
import { ProductRejectedDomainEvent } from '@domain-events/product';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import { ProductApprovalDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import {
  ProductBusinessEnforcer,
  ReviewerBusinessEnforcer,
} from '@use-cases/application-services/process';

export type RejectProductProcessSuccess = ProductRejectedDomainEvent;

type ProductFailure = Array<
  | ProductDomainExceptions.DoesNotExist
  | ProductDomainExceptions.NotSubmittedForApproval
>;
type ReviewerFailure = Array<
  | ReviewerDomainExceptions.DoesNotExist
  | ReviewerDomainExceptions.NotAuthorizedToReject
>;

export type RejectProductProcessFailure = ProductFailure | ReviewerFailure;

@Injectable()
export class RejectProductProcess extends ProcessBase<
  RejectProductProcessSuccess,
  RejectProductProcessFailure
> {
  protected async enforceBusinessRules(
    command: RejectProductCommand,
  ): Promise<void> {
    const { productId, reviewerId } = command;

    await this.productEnforcer.productIdMustExist(productId);
    await this.reviewerEnforcer.reviewerIdMustExist(reviewerId);

    if (this.hasNoExceptions()) {
      this.reviewerEnforcer.reviewerMustBeAdmin();
      this.productEnforcer.productMustBeSubmittedForApproval();
    }
  }
  protected executeMainTask(
    command: RejectProductCommand,
  ): Promise<ProductRejectedDomainEvent> {
    return this.productApprovalService.rejectProduct(command);
  }

  constructor(
    private readonly productApprovalService: ProductApprovalDomainService,
    private readonly productEnforcer: ProductBusinessEnforcer<ProductFailure>,
    private readonly reviewerEnforcer: ReviewerBusinessEnforcer<ReviewerFailure>,
  ) {
    const composite = new CompositeBusinessRulesEnforcer();
    composite.addEnforcer(productEnforcer);
    composite.addEnforcer(reviewerEnforcer);
    super({
      compositeBusinessEnforcer: composite,
    });
  }
}
