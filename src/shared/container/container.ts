export class Container {
  private static instance: Container;
  private services: Map<symbol, any> = new Map();

  private constructor() {}

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  /**
   * Register a service in the container
   * @param identifier - Unique symbol identifier
   * @param instance - Service instance to register
   */
  public register<T>(identifier: symbol, instance: T): void {
    if (this.services.has(identifier)) {
      console.warn(`Service ${identifier.toString()} already registered`);
      return;
    }
    this.services.set(identifier, instance);
  }
  /**
   * Resolve a service from the container with type safety
   * @param identifier - Unique symbol identifier
   * @returns The registered service instance
   */
  public resolve<T>(identifier: symbol): T {
    const service = this.services.get(identifier);
    if (!service) {
      throw new Error(
        `Service ${identifier.toString()} not found in container`
      );
    }
    return service as T;
  }
  /**
   * Check if a service is registered
   * @param identifier - Unique symbol identifier
   * @returns true if service is registered
   */
  public has(identifier: symbol): boolean {
    return this.services.has(identifier);
  }
  /**
   * Clear all registered services (useful for testing)
   */
  public clear(): void {
    this.services.clear();
  }
  /**
   * Get all registered service identifiers
   */
  public getRegisteredServices(): symbol[] {
    return Array.from(this.services.keys());
  }
}
