import { User } from "@/domain/entities/User.entity";
import { IUserRepository } from "@/domain/interfaces/IUserRepository";
import { UserModel } from "../models/User.Model";
import { UserMapper } from "../mappers/User.mapper";

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email: email.toLowerCase() });
    return doc ? UserMapper.mapToEntity(doc) : doc;
  }
  async findAdmins(): Promise<User[]> {
    const docs = await UserModel.find({ role: "admin" }).select("-password");
    return docs.map((doc) => UserMapper.mapToEntity(doc));
  }
  async create(entity: User): Promise<User> {
    const doc = await UserModel.create({
      email: entity.email,
      name: entity.name,
      phone: entity.phone,
      password: entity.password,
      role: entity.role,
    });
    return UserMapper.mapToEntity(doc);
  }
  async findAll(): Promise<User[]> {
    const docs = await UserModel.find().sort({ createdAt: -1 });
    return docs.map((doc) => UserMapper.mapToEntity(doc));
  }
  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id);
    return doc ? UserMapper.mapToEntity(doc) : null;
  }
  async update(id: string, payload: Partial<User>): Promise<User | null> {
    const doc = await UserModel.findByIdAndUpdate(
      id,
      { payload, updatedAt: new Date() },
      { new: true }
    );
    return doc ? UserMapper.mapToEntity(doc) : null;
  }
  async delete(id: string): Promise<boolean> {
    const result = UserModel.findByIdAndDelete(id);
    return !!result;
  }
}
