import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { User, UserRole } from "../../domain/entities/User.entity";
import {
  RegisterDTO,
  LoginDTO,
  UserResponseDTO,
  AuthResponseDTO,
} from "../dtos/AuthDTO";
import { IAuthService } from "../interface/IService";

export class AuthService implements IAuthService {
  constructor(private userRepository: IUserRepository) {}

  async register(data: RegisterDTO): Promise<AuthResponseDTO> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = new User(
      "",
      data.email,
      data.name,
      data.phone,
      hashedPassword,
      data.role || UserRole.CUSTOMER,
      new Date()
    );

    const created = await this.userRepository.create(user);
    const token = this.generateToken(created);

    return {
      user: this.mapToDTO(created),
      token,
    };
  }

  async login(credentials: LoginDTO): Promise<AuthResponseDTO> {
    const user = await this.userRepository.findByEmail(credentials.email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValid = await bcrypt.compare(credentials.password, user.password);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    const token = this.generateToken(user);

    return {
      user: this.mapToDTO(user),
      token,
    };
  }

  async verifyToken(token: string): Promise<UserResponseDTO> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
        userId: string;
      };
      const user = await this.userRepository.findById(decoded.userId);

      if (!user) throw new Error("User not found");

      return this.mapToDTO(user);
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  private generateToken(user: User): string {
    return jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );
  }

  private mapToDTO(user: User): UserResponseDTO {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
