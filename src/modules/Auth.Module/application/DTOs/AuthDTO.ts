import { UserRole } from "@/modules/Auth.Module/domain/entities/User.entity";

export interface RegisterDTO {
  email: string;
  name: string;
  phone: string;
  password: string;
  role?: UserRole;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface UserResponseDTO {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  createdAt: Date;
}

export interface AuthResponseDTO {
  user: UserResponseDTO;
  token: string;
}
