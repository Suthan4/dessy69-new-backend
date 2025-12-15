import { User } from "../entities/User.entity";
import { IRepository } from "./IRepository";

export interface IUserRepository extends IRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  findAdmins():Promise<User[]>
}
