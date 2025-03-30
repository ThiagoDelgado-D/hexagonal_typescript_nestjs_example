# NestJS TypeORM Hexagonal Example

This project is a comprehensive example demonstrating how to apply the **Hexagonal Architecture** (also known as Ports and Adapters) in a NestJS application using TypeORM. The goal is to clearly separate responsibilities, making the project scalable, maintainable, and easy to understand by others.

## Contents
- [NestJS TypeORM Hexagonal Example](#nestjs-typeorm-hexagonal-example)
  - [Contents](#contents)
  - [Hexagonal Architecture](#hexagonal-architecture)
  - [Project Structure](#project-structure)
  - [Use Cases and Domain](#use-cases-and-domain)
  - [Infrastructure and Adapters](#infrastructure-and-adapters)
  - [Configuration and Integration](#configuration-and-integration)
  - [Running the Project](#running-the-project)
  - [Conclusion](#conclusion)

## Hexagonal Architecture

The Hexagonal Architecture is based on the idea that the application's **core** (the domain) should be isolated from external details such as data persistence, user interfaces, or third-party services. In this example, you can observe the following:

- **Ports and Adapters:**
  - **Ports (Interfaces):** The domain layer defines interfaces like `UserRepository`, which act as contracts for operations (create, retrieve, update, delete) on the _User_ entity.
  - **Adapters (Implementations):**  
    - **Outgoing Adapters:** Implementations in the infrastructure layer (e.g., `TUserRepository` using TypeORM or an in-memory repository) that fulfill the repository contract.
    - **Incoming Adapters:** NestJS controllers (such as `UserController`) receive HTTP requests and translate them into calls to the domain’s use cases.

- **Dynamic Dependency Injection:**  
  A helper function (`createProvider`) is used to centralize provider creation and avoid code duplication when injecting use cases that depend on the repository. This pattern makes it easy to configure similar providers for additional modules or entities in the future.

## Project Structure

The project is organized to reflect a clear separation of concerns:

- **src/lib/User/domain:**  
  Contains the domain entities, value objects, and interfaces (e.g., `User`, `UserId`, `UserName`, `UserEmail`, `UserCreatedAt`, and `UserRepository`). This layer encapsulates business rules and validations without concern for persistence details.

- **src/lib/User/application:**  
  Contains use cases (or application services) that coordinate business logic. Each operation (such as creating, editing, deleting, or retrieving users) is implemented in a separate class (e.g., `UserCreate`, `UserEdit`, `UserDelete`, `UserGetAll`, and `UserGetOneById`).  
  These classes depend only on the abstractions defined in the domain layer, making the business logic testable and independent of the underlying infrastructure.

- **src/lib/User/infraestructure:**  
  Contains adapters that bridge the domain with external systems:
  - **TypeOrm:**  
    - `UserEntity` maps the domain entity to the database table.
    - `TUserRepository` is the concrete implementation of `UserRepository` using TypeORM for data manipulation.
  - **NestJs:**  
    - `user.controller.ts` exposes REST API endpoints that interact with the use cases.
    - `user.module.ts` organizes the user module, registering both the controller and dynamic providers created via `createProvider`.
  - **Helpers:**  
    - `createProvider.ts` allows for dynamic provider creation, centralizing dependency injection logic and reducing repetition.

- **Other Configuration and Root Files:**  
  - `app.module.ts` integrates all modules and configures global dependencies (e.g., environment variables through `ConfigModule` and database connection with TypeORM).
  - `main.ts` boots up the NestJS application.
  - Configuration files like `.eslintrc.js`, `tsconfig.json`, and `.prettierrc` ensure code quality, type checking, and formatting.

## Use Cases and Domain

- **Domain Layer:**  
  Defines business models and value objects (e.g., `User`, `UserId`, `UserName`). These components encapsulate business rules and validations.

- **Application Layer:**  
  Implements the use cases that orchestrate the business logic. For example:
  - The `UserCreate` use case accepts input, constructs a `User` instance using value objects, and delegates persistence to the repository.
  - The `UserGetOneById` use case performs a lookup and, if the user is not found, throws a domain-specific error (e.g., `UserNotFoundError`).

By depending on abstractions (interfaces) rather than concrete implementations, the domain remains pure and testable, independent of the underlying persistence mechanism.

## Infrastructure and Adapters

- **Outgoing Adapters:**  
  These are implementations of the `UserRepository` interface:
  - `TUserRepository` uses TypeORM to map database tables to domain entities.
  - `InMemoryUserRepository` is an alternative for test environments or scenarios where persistence is not required.

- **Incoming Adapters:**  
  NestJS controllers (e.g., `UserController`) expose HTTP endpoints. They use dependency injection (with tokens generated via `createProvider`) to connect HTTP requests to domain use cases.

This separation ensures that each module is cohesive, and changes in infrastructure (e.g., switching from TypeORM to another ORM) have minimal impact on the domain and application layers.

## Configuration and Integration

The application is bootstrapped using the **AppModule**:

- **Global Configuration:**  
  `ConfigModule` is used for managing environment variables globally.
  
- **Database Connection:**  
  `TypeOrmModule.forRootAsync` is used to configure the database connection dynamically by injecting `ConfigService` to retrieve settings like the `DATABASE_URL`.

- **Module Integration:**  
  Both the entity registration (using `TypeOrmModule.forFeature`) and the user module are integrated here, ensuring that dependency injection is managed seamlessly throughout the application.

## Running the Project

1. **Install Dependencies:**

   ```bash
   npm install
   ```

2. **Set Up Environment Variables:**

   Create a local environment file (e.g., `.env.development.local`) and define at least the `DATABASE_URL` variable.

3. **Build and Start the Application:**

   ```bash
   npm run build
   npm start
   ```

4. **Run in Development Mode:**

   ```bash
   npm run start:dev
   ```

5. **Run Tests (Unit and E2E):**

   ```bash
   npm run test
   npm run test:e2e
   ```

## Conclusion

This project serves as a robust example of implementing Hexagonal Architecture in a NestJS application. Its modular design ensures that the domain remains pure and easily testable, while the infrastructure can be modified or extended with minimal impact on business logic. Explore the codebase to see how clear separation of concerns can lead to a scalable and maintainable project structure.

Feel free to contribute or raise any questions about the implementation!