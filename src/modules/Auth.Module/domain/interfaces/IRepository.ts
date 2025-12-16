export interface IRepository<T> {
  create(entity: T): Promise<T>;
  findAll(
    page: number,
    limit: number
  ): Promise<{ payload: T[]; total: number }>;
  findById(id: string): Promise<T | null>;
  update(id: string, payload: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}
