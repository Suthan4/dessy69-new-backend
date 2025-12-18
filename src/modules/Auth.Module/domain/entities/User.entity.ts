import { UserRole } from "@/shared/types/common.types";

export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly name: string,
    public readonly role: UserRole,
    public readonly phone?: string,
    public readonly address?: string,
    public readonly isActive: boolean = true,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  public isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  public isCustomer(): boolean {
    return this.role === UserRole.CUSTOMER;
  }

  public canPlaceOrder(): boolean {
    return this.isActive && this.isCustomer();
  }

  public static create(
    email: string,
    passwordHash: string,
    name: string,
    role: UserRole,
    phone?: string,
    address?: string,
  ): UserEntity {
    return new UserEntity(
      "",
      email.toLowerCase().trim(),
      passwordHash,
      name.trim(),
      role,
      phone,
      address
    );
  }
}
