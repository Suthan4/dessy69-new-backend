import { AuthResponseDTO, LoginDTO, RegisterDTO } from "../DTOs/AuthDTO";
import { UserEntity } from "../../domain/entities/User.entity";
import { UserRole } from "@/shared/types/common.types";
import { IAuthService } from "../DTOs/IAuthService";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import bcrypt from "bcryptjs";
import { AppConfig } from "@/config/app.config";
import jwt from "jsonwebtoken";


export class AuthService implements IAuthService {
  constructor(private userRepository: IUserRepository) {}

  async register(dto: RegisterDTO): Promise<AuthResponseDTO> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new Error("Email already registered");
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = UserEntity.create(
      dto.email,
      passwordHash,
      dto.name,
      UserRole.CUSTOMER,
      dto.phone,
      dto.address
    );
    const savedUser = await this.userRepository.create(user);

    const token = this.generateToken(savedUser);
    return new AuthResponseDTO(token, {
      id: savedUser.id,
      email: savedUser.email,
      name: savedUser.name,
      role: savedUser.role,
    });
  }

  async login(dto: LoginDTO): Promise<AuthResponseDTO> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    if (!user.isActive) {
      throw new Error("Account is deactivated");
    }

    const token = this.generateToken(user);
    return new AuthResponseDTO(token, {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  }

  async validateToken(token: string): Promise<UserEntity | null> {
    try {
      const decoded = jwt.verify(token, AppConfig.jwt.secret) as any;
      return await this.userRepository.findById(decoded.userId);
    } catch {
      return null;
    }
  }

  private generateToken(user: UserEntity): string {
    return jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      AppConfig.jwt.secret,
      { expiresIn: AppConfig.jwt.expiresIn as jwt.SignOptions["expiresIn"] }
    );
  }
}
