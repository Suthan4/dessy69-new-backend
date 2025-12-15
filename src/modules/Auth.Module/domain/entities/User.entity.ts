export enum UserRole {
  CUSTOMER = "customer",
  ADMIN = "admin",
}
export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public name: string,
    public phone: string,
    public password: string,
    public role: UserRole,
    public createdAt: Date
  ) {}

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }
}
