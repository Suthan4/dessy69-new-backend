import { UserEntity } from "../../domain/entities/User.entity";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { UserModel } from "../models/User.Model";

export class UserRepository implements IUserRepository{
  async create(user: UserEntity): Promise<UserEntity> {
    const userDoc = await UserModel.create({
      email: user.email,
      passwordHash: user.passwordHash,
      name: user.name,
      role: user.role,
      phone: user.phone,
      address: user.address,
      isActive: user.isActive,
    });
    return this.toEntity(userDoc);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await UserModel.findById(id);
    return user ? this.toEntity(user) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    return user ? this.toEntity(user) : null;
  }

  async update(
    id: string,
    data: Partial<UserEntity>
  ): Promise<UserEntity | null> {
    const user = await UserModel.findByIdAndUpdate(id, data, { new: true });
    return user ? this.toEntity(user) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id);
    return !!result;
  }

  async findAll(
    page: number,
    limit: number
  ): Promise<{ payload: UserEntity[]; total: number }> {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      UserModel.find().skip(skip).limit(limit),
      UserModel.countDocuments(),
    ]);
    return { payload: users.map((u) => this.toEntity(u)), total };
  }

  private toEntity(doc: any): UserEntity {
    return new UserEntity(
      doc._id.toString(),
      doc.email,
      doc.passwordHash,
      doc.name,
      doc.role,
      doc.phone,
      doc.address,
      doc.isActive,
      doc.createdAt,
      doc.updatedAt
    );
  }
}
