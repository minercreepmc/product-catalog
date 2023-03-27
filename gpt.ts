export class ProductAggregate extends AbstractAggregateRoot<
  Partial<ProductAggregateDetails>
> {
  constructor(id?: ProductIdValueObject) {
    super({ id: id ? id : new ProductIdValueObject(), details: {} });
    this.setStatus(ProductStatus.INITIAL);
  }

  getStatus(): string {
    return this.details.status.unpack();
  }

  setStatus(newStatus: ProductStatus): void {
    this.details.status = new ProductStatusValueObject(newStatus);
  }

  createProduct(options: CreateProductAggregateOptions) {
    if (this.getStatus() === ProductStatus.DRAFT) {
      throw new InvalidOperationException();
    }
    this.details.name = options.name;
    this.details.price = options.price;

    if (options.description) {
      this.details.description = options.description;
    }
    if (options.image) {
      this.details.image = options.image;
    }

    if (options.attributes) {
      this.details.attributes = options.attributes;
    }

    this.setStatus(ProductStatus.DRAFT);

    return new ProductCreatedDomainEvent({
      productId: this.id,
      details: {
        name: this.details.name,
        price: this.details.price,
      },
    });
  }

  updateProduct(options: UpdateProductAggregateOptions) {
    if (options.name) {
      this.details.name = options.name;
    }
    if (options.description) {
      this.details.description = options.description;
    }
    if (options.price) {
      this.details.price = options.price;
    }
    if (options.image) {
      this.details.image = options.image;
    }
    if (options.attributes) {
      this.details.attributes = options.attributes;
    }

    return new ProductUpdatedDomainEvent({
      productId: this.id,
      details: {
        name: this.details.name,
        price: this.details.price,
      },
    });
  }
}
