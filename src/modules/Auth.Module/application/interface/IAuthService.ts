import { UserEntity } from "../../domain/entities/User.entity";
import { AuthResponseDTO, LoginDTO, RegisterDTO } from "../DTOs/AuthDTO";

export interface IAuthService {
  register(dto: RegisterDTO): Promise<AuthResponseDTO>;
  login(dto: LoginDTO): Promise<AuthResponseDTO>;
  validateToken(token: string): Promise<UserEntity | null>;
}
