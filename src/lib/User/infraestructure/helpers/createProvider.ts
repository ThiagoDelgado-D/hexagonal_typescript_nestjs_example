/**
 * Creates a dynamic provider for a service that depends on a repository.
 *
 * @param token - The token used to identify the provider.
 * @param Service - The service class that requires a repository.
 * @param repositoryToken - The token that resolves the repository dependency.
 * @returns An object containing the provider definition.
 */

export const createProvider = <Repository, T>(
    token: string,
    Service: new (repository: Repository) => T,
    repositoryToken: any,
  ) => ({
    provide: token,
    useFactory: (repository: Repository) => new Service(repository),
    inject: [repositoryToken],
  });