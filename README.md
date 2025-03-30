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
    - **Incoming Adapters:** NestJS controllers (such as `UserController`) receive HTTP requests and translate them into calls to the domain’s use cases. Note that endpoints such as the PUT and DELETE routes now expect an `:id` parameter in the URL so that validation using the DTO (`FindOneParams`) applies correctly.

- **Dynamic Dependency Injection:**  
  A helper function (`createProvider`) is used to centralize provider creation and avoid code duplication when injecting use cases that depend on the repository. This pattern facilitates configuring similar providers for additional modules or entities in the future.

## Project Structure

The project is organized to reflect a clear separation of concerns:

- **src/lib/User/domain:**  
  Contains the domain entities, value objects, and interfaces (e.g., `User`, `UserId`, `UserName`, `UserEmail`, `UserCreatedAt`, and `UserRepository`). This layer encapsulates business rules and validations without concern for persistence details.

- **src/lib/User/application:**  
  Contains use cases (or application services) that coordinate business logic. Each operation (such as creating, editing, deleting, or retrieving users) is implemented in its own class (e.g., `UserCreate`, `UserEdit`, `UserDelete`, `UserGetAll`, and `UserGetOneById`).  
  These classes depend solely on the abstractions defined in the domain layer, keeping the business logic testable and independent of the underlying infrastructure.

- **src/lib/User/infraestructure:**  
  Contains adapters that bridge the domain with external systems:
  - **TypeOrm:**  
    - `TUserEntity` maps the domain entity to the database table.
    - `TUserRepository` is the concrete implementation of `UserRepository` using TypeORM for data manipulation.
  - **NestJs:**  
    - `user.controller.ts` exposes REST API endpoints that interact with the use cases. Note that the PUT and DELETE routes now expect an `:id` parameter in the URL.
    - `user.module.ts` organizes the user module, registering both the controller and dynamic providers created via `createProvider`.
  - **Helpers:**  
    - `createProvider.ts` allows for dynamic provider creation, centralizing dependency injection logic and reducing repetition.
  - **Constants:**  
    - `constants.ts` defines environment-related values (i.e. `nodeEnv` and `isProduction`), which are used to conditionally configure settings. For example, the TypeORM property `synchronize` is set based on whether the environment is production.

- **Other Configuration and Root Files:**  
  - `app.module.ts` integrates all modules and configures global dependencies (e.g., loading environment variables through the `ConfigModule` and establishing the database connection with TypeORM).  
    The connection is set to have `synchronize` disabled in production and enabled in development.
  - `main.ts` boots up the NestJS application and sets a global validation pipe.
  - Configuration files like `.eslintrc.js`, `tsconfig.json`, and `.prettierrc` ensure code quality, type checking, and formatting.

## Use Cases and Domain

- **Domain Layer:**  
  Defines business models and value objects (e.g., `User`, `UserId`, `UserName`). These components encapsulate business rules and validations.

- **Application Layer:**  
  Implements the use cases that orchestrate the business logic. For example:
  - The `UserCreate` use case accepts input (using value objects like `UserEmail` and `UserId`), creates a `User` instance, and delegates persistence to the repository.
  - The `UserGetOneById` use case retrieves a user and throws a domain-specific error (`UserNotFoundError`) if the user does not exist.
  
This abstraction keeps the domain pure and testable.

## Infrastructure and Adapters

- **Outgoing Adapters:**  
  Implementations of the `UserRepository` interface:
  - `TUserRepository` utilizes TypeORM to map database tables to domain entities.
  - `InMemoryUserRepository` is available for testing scenarios or situations where real persistence is not required.

- **Incoming Adapters:**  
  NestJS controllers (like `UserController`) expose HTTP endpoints. They use dependency injection (with tokens generated by `createProvider`) to connect HTTP requests to domain use cases.

## Configuration and Integration

- **Global Configuration:**  
  `ConfigModule` is used for managing environment variables globally.  
  The file `.dev.env` (or other environment-specific files) is loaded during application startup.

- **Database Connection:**  
  The database connection in `app.module.ts` is configured to use TypeORM.  
  Entities (such as `TUserEntity`) are registered, and the `synchronize` property is conditionally set:
  - In production (`NODE_ENV === 'production'`), `synchronize` is set to `false`.
  - Otherwise (i.e., during development), `synchronize` is `true`.

  **Supabase Integration:**  
  For increased agility, this project uses Supabase to connect directly to a PostgreSQL database via a connection URL string. The `DATABASE_URL` environment variable (provided by Supabase) is used as the connection string, enabling seamless integration with PostgreSQL.

- **Module Integration:**  
  Both the user module and the entity registration occur in `app.module.ts`, ensuring that dependency injection is managed seamlessly throughout the application.

## Running the Project

1. **Install Dependencies:**

   ```bash
   npm install
   ```

2. **Set Up Environment Variables:**

   Create a local environment file (e.g., `.env.development.local`) and define at least the `DATABASE_URL` variable (provided by Supabase) along with `NODE_ENV`.

3. **Build and Start the Application:**

   ```bash
   npm run build
   npm start
   ```

4. **Run in Development Mode:**

   ```bash
   npm run start:dev
   ```

## Conclusion

This project serves as a robust example of implementing Hexagonal Architecture in a NestJS application. Its modular design ensures that the domain remains pure and easily testable, while changes to the infrastructure (such as switching database synchronization behavior based on the environment or integrating Supabase for PostgreSQL connectivity) have minimal impact on the business logic. Explore the codebase to see how a clear separation of concerns leads to a scalable and maintainable project structure.

Feel free to contribute or raise any questions about the implementation!