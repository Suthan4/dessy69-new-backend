import { Container } from "@/shared/container/container";
import { UserRepository } from "../infrastructure/repositories/UserRepository";
import { TYPES } from "@/shared/container/types";
import { AuthService } from "../application/services/Auth.service";
import { AuthController } from "../presentation/controllers/Auth.controller";

export function registerAuthModule(container: Container): void {
  console.log("📦 Registering Auth Module...");

  // 1. Register Repository
  const userRepository = new UserRepository();
  container.register(TYPES.UserRepository, userRepository);

  // 2. Register Service (depends on repository)
  const authService = new AuthService(container.resolve(TYPES.UserRepository));
  container.register(TYPES.AuthService, authService);

  // 3. Register Controller (depends on service)
  const authController = new AuthController(
    container.resolve(TYPES.AuthService)
  );
  container.register(TYPES.AuthController, authController);

  console.log("✅ Auth Module registered");
}
