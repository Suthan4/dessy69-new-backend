export interface IRepository<T> {
  create(entity: T): Promise<T>;
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T|null>;
  update(id: string, payload: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}
