# ARCHITECTURE & SYSTEM DESIGN

---

## Purpose

This document describes the system architecture, design patterns, layer separation, and data flow.

---

## Core Principles

- **Separation of Concerns**: UI ≠ Logic ≠ Data
- **Dependency Rule**: Outer layers depend on Inner layers. Never reverse.
- **Single Responsibility**: One class, one job
- **Cohesion > Coupling**: High cohesion within layers, low coupling between layers

---

## Layered Architecture Pattern

### Layers (Top to Bottom)

```
┌─────────────────────────────────────┐
│   Presentation / UI                 │
│   (Views, Controllers, ViewModels)  │
└───────────────┬─────────────────────┘
                │
                ↓
┌─────────────────────────────────────┐
│   Domain / Business Logic           │
│   (Use Cases, Interactors, Entities)│
└───────────────┬─────────────────────┘
                │
                ↓
┌─────────────────────────────────────┐
│   Data / Repository Layer           │
│   (Repositories, API, DB impl)      │
└───────────────┬─────────────────────┘
                │
                ↓
┌─────────────────────────────────────┐
│   Data Sources                      │
│   (Network, Database, File System)  │
└─────────────────────────────────────┘
```

---

### Layer Definitions

#### **Presentation Layer** (Outer)
- **Responsibility**: UI logic only. NO business rules.
- **Components**:
  - Views / UI components
  - Controllers / Presenters
  - ViewModels / StateManagers
  - Event handlers / User interactions

- **Dependencies**: Domain layer only
- **Constraints**:
  - NO direct database queries
  - NO business logic
  - Observes domain state, dispatches actions

**Example**:
```
View observes ViewModel → User clicks → ViewModel dispatches UseCase → Domain processes
```

---

#### **Domain Layer** (Core)
- **Responsibility**: Pure business logic. Platform-agnostic (ideal).
- **Components**:
  - Use Cases / Interactors
  - Entities / Business objects
  - Business rules
  - Value Objects
  - Domain Exceptions

- **Dependencies**: NO external dependencies (only domain classes)
- **Constraints**:
  - NO framework-specific code
  - NO platform dependencies
  - Testable in isolation
  - Framework-agnostic

**Example**:
```
Use Case: CalculateDiscount
Input: OrderTotal, CustomerType
Output: DiscountAmount
Logic: Pure business rule
```

---

#### **Data Layer** (Outer)
- **Responsibility**: Handle data access and repository implementations.
- **Components**:
  - Repositories (implement domain interfaces)
  - API clients
  - Database implementations
  - Cache implementations
  - Mappers (DTO ↔ Entity)

- **Dependencies**: Domain layer (via interfaces)
- **Constraints**:
  - Hide data source specifics from Domain
  - Implement Repository interfaces defined in Domain
  - Handle data transformation

**Example**:
```
Domain defines: IUserRepository interface
Data implements: UserRepositoryImpl (Database)
                 UserRepositoryMock (Testing)
```

---

#### **Data Sources** (Bottom)
- **Responsibility**: Raw data access.
- **Components**:
  - HTTP clients
  - Database drivers
  - File system access
  - Cache clients
  - Message brokers

- **Dependencies**: Framework/SDK specific
- **Constraints**:
  - Low-level access only
  - No business logic
  - Error handling and retry logic local to source

---

## Data Flow Pattern

### Unidirectional Data Flow

```
User Input
    ↓
View/UI Component
    ↓
Event Handler / ViewModel
    ↓
Domain Use Case / Interactor
    ↓
Repository Interface (Domain)
    ↓
Repository Implementation (Data)
    ↓
Data Source (HTTP, DB, File, Cache)
    ↓
Response bubbles back up
    ↓
State Update in Domain
    ↓
UI observes and re-renders
```

### Key Principles
1. **Unidirectional**: Data flows one direction, results come back
2. **Immutable**: Entities don't modify in-place; new instances returned
3. **Observable**: UI observes state changes (reactive pattern)
4. **Async-Safe**: Proper handling of cancellation and lifecycles

---

## Dependency Direction (Crucial)

```
Presentation → Domain ← Data

CORRECT:
- Presentation imports Domain
- Data imports Domain
- Domain imports NOTHING from outside

WRONG (Never do this):
- Domain imports Data
- Domain imports Presentation
- Data imports Presentation
```

---

## Design Patterns in Use

### Repository Pattern
- **Purpose**: Abstraction over data sources
- **Implementation**:
  - Domain defines interface
  - Data implements interface
  - Presentation uses domain interface (no knowledge of impl)

### Use Case / Interactor Pattern
- **Purpose**: Encapsulate business logic
- **Structure**:
  - Input data (Request)
  - Business logic (Execute)
  - Output data (Response)
  - Error handling

### Mapper Pattern
- **Purpose**: Transform data between layers
- **Components**:
  - DTOs (Data Transfer Objects)
  - Entities (Domain objects)
  - Mappers (Transform between them)

### Observer/Reactive Pattern
- **Purpose**: UI observes domain state changes
- **Components**:
  - State holder (Domain)
  - Subscribers (UI components)
  - State updates trigger re-renders

---

## File Organization by Layer

### Typical Structure (Example for Java)

```
project-root/
├── src/
│   ├── presentation/          # UI Layer
│   │   ├── controllers/       # Web/mobile controllers
│   │   ├── views/             # UI components
│   │   └── viewmodels/        # State management
│   │
│   ├── domain/                # Domain Layer (CORE)
│   │   ├── usecases/          # Use cases
│   │   ├── entities/          # Business objects
│   │   ├── repositories/      # Interface definitions
│   │   └── exceptions/        # Domain exceptions
│   │
│   ├── data/                  # Data Layer
│   │   ├── repositories/      # Repository implementations
│   │   ├── datasources/       # API clients, DB access
│   │   ├── mappers/           # DTO ↔ Entity transformers
│   │   └── models/            # DTOs, API models
│   │
│   └── config/                # Configuration
│       ├── dependency_injection/ # DI container setup
│       └── constants.java       # App constants
│
├── tests/
│   ├── unit/                  # Domain + Data unit tests
│   ├── integration/           # Data source integration tests
│   └── ui/                    # UI/E2E tests
│
└── resources/
    ├── application.properties # Configuration
    └── schemas/               # Database schemas
```

---

## Critical Design Rules

### Rule 1: Presentation Has NO Business Logic
❌ **Wrong**:
```java
button.onClick(() -> {
    int discount = total * 0.1;  // Business logic in UI!
    updateDisplay(discount);
});
```

✅ **Correct**:
```java
button.onClick(() -> viewModel.applyDiscount());
// ViewModel dispatches UseCase in Domain
```

---

### Rule 2: Domain Has NO Framework Code
❌ **Wrong**:
```java
public class Order {
    @Entity
    @Table("orders")  // Framework annotations in domain
    String id;
}
```

✅ **Correct**:
```java
// Domain
public class Order {
    String id;
    int total;
}

// Data
@Entity
@Table("orders")
class OrderEntity {
    // Maps to Order
}
```

---

### Rule 3: Dependency Direction is Strict
❌ **Wrong**:
```java
// Data importing Domain
public class UserRepository {
  public User fromDTO(UserDTO dto) { /* omitted */ }
}
```

✅ **Correct**:
```java
// Domain interface (no impl)
public interface UserRepository {
    User getUserById(String id);
}

// Data implements
public class UserRepositoryImpl implements UserRepository { /* omitted */ }
```

---

## Async Handling & Threading

### Main Thread (UI Thread)
- UI updates ONLY

### Worker Threads
- Database queries
- Network requests
- File operations
- Heavy computation

### Threading Model
```
UI Thread (Main)
    ↓ Dispatch async task
Worker Thread
    ↓ Process (Domain logic, Data query)
    ↓ Return result
UI Thread (Main)
    ↓ Update UI
```

---

## Error Handling & Resilience

### Error Flow
1. **Data Source**: Catches low-level errors (network timeouts, DB errors)
2. **Repository**: Transforms to domain exceptions
3. **Use Case**: Handles business logic errors
4. **Presentation**: Displays user-friendly messages

### Exception Types
- **Domain Exceptions**: Business rule violations (InvalidOrderException)
- **Data Exceptions**: Source-specific (DatabaseException, NetworkException)
- **Flow Exceptions**: Cancellation, timeout (CancellationException)

---

## Testing Strategy

### By Layer

| Layer | Test Type | Mock Dependencies | Focus |
|-------|-----------|-------------------|-------|
| **Domain** | Unit | None (pure logic) | Business rules, algorithms |
| **Data** | Integration | Actual sources (test DB) | Data transformation, persistence |
| **Presentation** | UI/Integration | Domain (mock Use Cases) | User interactions, state updates |

### Test Structure
```
domain/usecases/CalculateDiscountTest.java
    ├── Pure business logic tests
    ├── No mocks/stubs needed
    └── Fast execution

data/repositories/UserRepositoryTest.java
    ├── Test with real DB (or in-memory)
    ├── Test API client mocking
    └── Test data transformation

presentation/viewmodels/OrderViewModelTest.java
    ├── Mock Domain Use Cases
    ├── Test state changes
    └── Test UI event handling
```

---

## Documentation & References

See also:
- [DEV_OPS.md](DEV_OPS.md) — Build & deployment
- [TECH_STACK.md](TECH_STACK.md) — Technology details
- [TECH_REQUIREMENTS.md](../dev/TECH_REQUIREMENTS.md) — Versions & constraints
- [AGENT_WORKFLOW.md](../dev/AGENT_WORKFLOW.md) — Process rules

