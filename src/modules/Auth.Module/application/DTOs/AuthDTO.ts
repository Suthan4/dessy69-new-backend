import { UserRole } from "@/shared/types/common.types";

export class RegisterDTO {
  constructor(
    public email: string,
    public password: string,
    public name: string,
    public role: UserRole,
    public phone?: string,
    public address?: string,
  ) {}
}

export class LoginDTO {
  constructor(public email: string, public password: string) {}
}

export class AuthResponseDTO {
  constructor(
    public token: string,
    public user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
    }
  ) {}
}
