import { CompositeBusinessRulesEnforcer, ProcessBase } from '@base/use-cases';
import { SubmitForApprovalCommand } from '@commands';
import { ProductSubmittedDomainEvent } from '@domain-events/product';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import { ProductApprovalDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import {
  ProductBusinessEnforcer,
  ReviewerBusinessEnforcer,
} from '@use-cases/application-services/process';

export type SubmitForApprovalProcessSuccess = ProductSubmittedDomainEvent;

type ProductFailure = Array<ProductDomainExceptions.DoesNotExist>;
type ReviewerFailure = Array<ReviewerDomainExceptions.DoesNotExist>;

export type SubmitForApprovalProcessFailure = ProductFailure | ReviewerFailure;

@Injectable()
export class SubmitForApprovalProcess extends ProcessBase<
  SubmitForApprovalProcessSuccess,
  SubmitForApprovalProcessFailure
> {
  protected async enforceBusinessRules(
    command: SubmitForApprovalCommand,
  ): Promise<void> {
    const { reviewerId, productId } = command;

    await this.reviewerEnforcer.reviewerIdMustExist(reviewerId);
    await this.productEnforcer.productIdMustExist(productId);
  }
  protected executeMainTask(
    command: SubmitForApprovalCommand,
  ): Promise<ProductSubmittedDomainEvent> {
    return this.productApprovalService.submitForApproval(command);
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
