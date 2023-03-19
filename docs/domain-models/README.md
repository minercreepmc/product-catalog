# Product Catalog Domain Model

The Product Catalog domain model consists of several aggregates, entities, and value objects designed using the Domain-Driven Design (DDD) aggregate pattern. This documentation provides an overview of the different components of the domain model.

## Aggregates

### Product

The Product aggregate is the central component of the Product Catalog. It represents an individual product in the catalog and contains all necessary information about the product, such as its name, description, price, and categories.

#### Entities

- **Product** (Aggregate Root): Represents a single product in the catalog. Contains product attributes and references to other associated entities and value objects.

#### Value Objects

- **ProductId**: A unique identifier for a product.
- **ProductName**: The name of the product.
- **ProductDescription**: A brief description of the product.
- **ProductPrice**: The price of the product.
- **ProductImage**: A URL pointing to the product's image.
- **ProductAttributes**: A collection of key-value pairs representing additional product attributes (e.g., color, size, weight).

#### Methods

- **submitForApproval(reviewerId: ReviewerId)**: Submit the product for approval by a reviewer.
- **approve(reviewerId: ReviewerId)**: Mark the product as approved by a reviewer.
- **reject(reviewerId: ReviewerId, reason: string)**: Mark the product as rejected by a reviewer and provide a reason for the rejection.

### Category

The Category aggregate represents a hierarchical grouping of products. Categories allow users to browse products based on their classifications.

#### Entities

- **Category** (Aggregate Root): Represents a single category in the catalog. Contains category attributes and references to other associated entities and value objects.

#### Value Objects

- **CategoryId**: A unique identifier for a category.
- **CategoryName**: The name of the category.
- **CategoryDescription**: A brief description of the category.
- **CategoryPath**: A list of category IDs representing the hierarchical path of the category.

### Reviewer

The Reviewer aggregate is responsible for reviewing and approving or rejecting products before they are published in the catalog. This process ensures the quality and appropriateness of the items listed.

#### Entities

- **Reviewer** (Aggregate Root): Represents a single reviewer who can approve or reject products in the catalog. Contains the reviewer's attributes and references to other associated entities and value objects.

#### Value Objects

- **ReviewerId**: A unique identifier for a reviewer.
- **ReviewerName**: The name of the reviewer.
- **ReviewerEmail**: The email address of the reviewer.

## Domain Services

### Product Approval Process

This domain service manages the product approval process. It works with the Product and Reviewer aggregates to handle the submission, approval, and rejection of products in the catalog.

#### Methods

- **submitProductForApproval(productId: ProductId, reviewerId: ReviewerId)**: Submit a product for approval by a reviewer.
- **approveProduct(productId: ProductId, reviewerId: ReviewerId)**: Approve a submitted product.
- **rejectProduct(productId: ProductId, reviewerId: ReviewerId, reason: string)**: Reject a submitted product, providing a reason for the rejection.

## Common Value Objects

### Money

A value object representing a monetary value. Used to represent product prices and discounts.

- **Amount**: The numerical value of the money.
- **Currency**: The currency in which the money is denominated.

### Dimensions

A value object representing the dimensions of a product, such as length, width, and height.

- **Length**: The length of the product.
- **Width**: The width of the product.
- **Height**: The height of the product.
- **Unit**: The dimension unit of the product.

### Weight

A value object representing the weight of a product.

- **Amount**: The numerical amount value of the weight.
- **Unit**: The unit of measurement for the weight (e.g., grams, kilograms, pounds).
