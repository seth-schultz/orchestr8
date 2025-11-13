---
id: architecture-layered
category: pattern
tags: [architecture, design-patterns, separation-of-concerns, enterprise, mvc, layers]
capabilities:
  - Layered architecture design (presentation, business, data)
  - Separation of concerns implementation
  - Dependency direction enforcement
  - Layer communication patterns
useWhen:
  - Enterprise applications with complex business logic requiring presentation, business, and data access layer separation with unidirectional dependencies
  - Clear separation of concerns needing controller-service-repository pattern with technology-agnostic business logic isolation
  - Traditional n-tier architecture where upper layers depend on lower layers through abstractions without reverse dependencies
  - Large team development requiring well-defined boundaries enabling independent work on controllers, services, and repositories
  - High maintainability requirements needing layer isolation where database changes don't impact business rules
estimatedTokens: 830
---

# Layered Architecture Pattern

A foundational architectural pattern that organizes code into horizontal layers, each with specific responsibilities and dependencies flowing in one direction.

## Core Layers

### Presentation Layer
- **Responsibility**: User interface, request handling, response formatting
- **Technologies**: REST APIs, GraphQL, web frameworks, view templates
- **Key Principle**: No business logic; delegate to business layer
- **Example**: Controllers, API routes, UI components

```typescript
// Presentation Layer - Controller
class UserController {
  constructor(private userService: UserService) {}
  
  async getUser(req: Request, res: Response) {
    const userId = req.params.id;
    const user = await this.userService.getUserById(userId);
    return res.json(user);
  }
}
```

### Business/Service Layer
- **Responsibility**: Business logic, workflows, domain rules, orchestration
- **Technologies**: Service classes, domain models, business rules engines
- **Key Principle**: Technology-agnostic; focuses on domain logic
- **Example**: Services, use cases, domain models

```typescript
// Business Layer - Service
class UserService {
  constructor(private userRepository: UserRepository) {}
  
  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundError('User not found');
    
    // Business logic
    if (user.isDeactivated()) {
      throw new BusinessError('User account is deactivated');
    }
    
    return user;
  }
}
```

### Data Access Layer
- **Responsibility**: Database operations, data persistence, external data sources
- **Technologies**: ORMs, query builders, database drivers
- **Key Principle**: Abstract data storage details from business layer
- **Example**: Repositories, DAOs, data mappers

```typescript
// Data Layer - Repository
class UserRepository {
  constructor(private db: Database) {}
  
  async findById(id: string): Promise<User | null> {
    const row = await this.db.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return row ? this.mapToUser(row) : null;
  }
}
```

## Key Principles

1. **Unidirectional Dependencies**: Upper layers depend on lower layers, never reverse
2. **Separation of Concerns**: Each layer has distinct, focused responsibilities
3. **Layer Isolation**: Changes in one layer minimize impact on others
4. **Abstraction**: Lower layers expose interfaces, hiding implementation details

## Benefits
- Clear code organization and maintainability
- Easy to test individual layers in isolation
- Team members can work on different layers independently
- Straightforward to understand for new developers

## Trade-offs
- Can lead to unnecessary abstraction for simple applications
- May introduce performance overhead with multiple layer transitions
- Risk of anemic domain models if business logic leaks into other layers

## When to Use
- Enterprise applications with complex business logic
- Applications requiring high maintainability and testability
- Teams with clear separation of roles (frontend, backend, database)
- Projects expected to scale in size and complexity

## Related Architecture Patterns

- **orchestr8://patterns/architecture-microservices** - Alternative to layered monolith for large systems
- **orchestr8://patterns/architecture-decision-records** - Document layering decisions
- **orchestr8://patterns/event-driven-cqrs** - CQRS can work within layered architecture
