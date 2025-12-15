import { AuthResponseDTO, LoginDTO, RegisterDTO, UserResponseDTO } from "./AuthDTO";

export interface IAuthService {
  register(data: RegisterDTO): Promise<AuthResponseDTO>;
  login(credentials: LoginDTO): Promise<AuthResponseDTO>;
  verifyToken(token: string): Promise<UserResponseDTO>;
}

