---
id: refactoring-patterns-complete
category: example
tags: [refactoring, patterns, clean-code, extract-method, polymorphism]
capabilities:
  - Extract method refactoring examples
  - Extract class for separation of concerns
  - Replace conditional with polymorphism
  - Parameter object introduction
  - Magic number elimination
useWhen:
  - Learning refactoring patterns through examples
  - Teaching code quality improvements
  - Establishing refactoring standards
estimatedTokens: 520
relatedResources:
  - orchestr8://skills/quality-refactoring-techniques
---

# Refactoring Patterns: Complete Examples

Comprehensive before/after examples of common refactoring patterns.

## Extract Method Pattern

### Long Method Refactoring

```typescript
// ❌ Bad: Long method doing multiple things
async function processOrder(orderId: string) {
  const order = await db.order.findById(orderId);

  // Validation
  if (!order) throw new Error('Order not found');
  if (order.status !== 'pending') throw new Error('Order already processed');

  // Calculate totals
  let subtotal = 0;
  for (const item of order.items) {
    subtotal += item.price * item.quantity;
  }
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  // Process payment
  const payment = await stripe.charges.create({
    amount: total * 100,
    currency: 'usd',
    source: order.paymentToken,
  });

  // Update order
  order.status = 'paid';
  order.paidAt = new Date();
  await db.order.update(order);

  // Send email
  await sendEmail(order.customer.email, 'Order confirmed');
}

// ✅ Good: Extracted methods
async function processOrder(orderId: string) {
  const order = await findAndValidateOrder(orderId);
  const total = calculateOrderTotal(order);
  const payment = await processPayment(order, total);
  await updateOrderStatus(order, payment);
  await sendOrderConfirmation(order);
}

async function findAndValidateOrder(orderId: string): Promise<Order> {
  const order = await db.order.findById(orderId);
  if (!order) throw new OrderNotFoundError(orderId);
  if (order.status !== 'pending') throw new OrderAlreadyProcessedError(orderId);
  return order;
}

function calculateOrderTotal(order: Order): number {
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * TAX_RATE;
  return subtotal + tax;
}
```

## Extract Class Pattern

### Separation of Concerns

```typescript
// ❌ Bad: God class
class User {
  id: string;
  email: string;
  password: string;

  // Profile data
  firstName: string;
  lastName: string;
  avatar: string;

  // Settings
  theme: string;
  notifications: boolean;
  language: string;

  // Subscription
  plan: string;
  subscriptionStatus: string;
  billingCycle: string;

  // Methods for all of the above
  updateProfile() { /* ... */ }
  updateSettings() { /* ... */ }
  updateSubscription() { /* ... */ }
  validatePassword() { /* ... */ }
}

// ✅ Good: Separate concerns
class User {
  id: string;
  email: string;
  passwordHash: string;
  profile: UserProfile;
  settings: UserSettings;
  subscription: Subscription;
}

class UserProfile {
  firstName: string;
  lastName: string;
  avatar: string;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

class UserSettings {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
}

class Subscription {
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired';
  billingCycle: 'monthly' | 'yearly';

  isActive(): boolean {
    return this.status === 'active';
  }
}
```

## Replace Conditional with Polymorphism

### Type Code Elimination

```typescript
// ❌ Bad: Type switching
class Order {
  type: 'standard' | 'express' | 'overnight';

  getShippingCost(): number {
    switch (this.type) {
      case 'standard':
        return 5;
      case 'express':
        return 15;
      case 'overnight':
        return 30;
    }
  }

  getDeliveryDays(): number {
    switch (this.type) {
      case 'standard':
        return 7;
      case 'express':
        return 3;
      case 'overnight':
        return 1;
    }
  }
}

// ✅ Good: Polymorphic classes
abstract class ShippingMethod {
  abstract getShippingCost(): number;
  abstract getDeliveryDays(): number;
}

class StandardShipping extends ShippingMethod {
  getShippingCost(): number { return 5; }
  getDeliveryDays(): number { return 7; }
}

class ExpressShipping extends ShippingMethod {
  getShippingCost(): number { return 15; }
  getDeliveryDays(): number { return 3; }
}

class OvernightShipping extends ShippingMethod {
  getShippingCost(): number { return 30; }
  getDeliveryDays(): number { return 1; }
}

class Order {
  constructor(private shippingMethod: ShippingMethod) {}

  getShippingCost(): number {
    return this.shippingMethod.getShippingCost();
  }

  getDeliveryDays(): number {
    return this.shippingMethod.getDeliveryDays();
  }
}
```

## Introduce Parameter Object

### Long Parameter List Solution

```typescript
// ❌ Bad: Too many parameters
function createInvoice(
  customerId: string,
  items: Item[],
  subtotal: number,
  tax: number,
  discount: number,
  shippingCost: number,
  billingAddress: string,
  shippingAddress: string,
  paymentMethod: string
) {
  // ...
}

// ✅ Good: Parameter object
interface InvoiceData {
  customerId: string;
  items: Item[];
  pricing: {
    subtotal: number;
    tax: number;
    discount: number;
    shippingCost: number;
  };
  addresses: {
    billing: string;
    shipping: string;
  };
  paymentMethod: string;
}

function createInvoice(data: InvoiceData) {
  // Clearer and easier to extend
}

// Usage
createInvoice({
  customerId: 'user-123',
  items: [...],
  pricing: {
    subtotal: 100,
    tax: 8,
    discount: 10,
    shippingCost: 5,
  },
  addresses: {
    billing: '123 Main St',
    shipping: '456 Oak Ave',
  },
  paymentMethod: 'credit_card',
});
```

## Replace Magic Numbers with Constants

```typescript
// ❌ Bad: Magic numbers everywhere
function calculateDiscount(orderTotal: number, customerYears: number): number {
  if (customerYears > 5 && orderTotal > 500) {
    return orderTotal * 0.15;
  } else if (customerYears > 2 && orderTotal > 200) {
    return orderTotal * 0.10;
  } else if (orderTotal > 100) {
    return orderTotal * 0.05;
  }
  return 0;
}

// ✅ Good: Named constants
const LOYALTY_TIERS = {
  GOLD: {
    yearsRequired: 5,
    orderMinimum: 500,
    discountRate: 0.15,
  },
  SILVER: {
    yearsRequired: 2,
    orderMinimum: 200,
    discountRate: 0.10,
  },
  BRONZE: {
    yearsRequired: 0,
    orderMinimum: 100,
    discountRate: 0.05,
  },
};

function calculateDiscount(orderTotal: number, customerYears: number): number {
  if (customerYears >= LOYALTY_TIERS.GOLD.yearsRequired &&
      orderTotal >= LOYALTY_TIERS.GOLD.orderMinimum) {
    return orderTotal * LOYALTY_TIERS.GOLD.discountRate;
  }

  if (customerYears >= LOYALTY_TIERS.SILVER.yearsRequired &&
      orderTotal >= LOYALTY_TIERS.SILVER.orderMinimum) {
    return orderTotal * LOYALTY_TIERS.SILVER.discountRate;
  }

  if (orderTotal >= LOYALTY_TIERS.BRONZE.orderMinimum) {
    return orderTotal * LOYALTY_TIERS.BRONZE.discountRate;
  }

  return 0;
}
```

## Guard Clauses Pattern

### Simplify Nested Conditions

```typescript
// ❌ Bad: Nested conditions
function processPayment(order: Order) {
  if (order) {
    if (order.isPaid === false) {
      if (order.total > 0) {
        // Process payment
        return chargeCard(order);
      } else {
        throw new Error('Invalid amount');
      }
    } else {
      throw new Error('Already paid');
    }
  } else {
    throw new Error('Order not found');
  }
}

// ✅ Good: Early returns
function processPayment(order: Order) {
  if (!order) {
    throw new OrderNotFoundError();
  }

  if (order.isPaid) {
    throw new OrderAlreadyPaidError(order.id);
  }

  if (order.total <= 0) {
    throw new InvalidAmountError(order.total);
  }

  return chargeCard(order);
}
```
