import { IRepository } from "./IRepository";
import { UserEntity } from "../entities/User.entity";

export interface IUserRepository extends IRepository<UserEntity> {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
}
