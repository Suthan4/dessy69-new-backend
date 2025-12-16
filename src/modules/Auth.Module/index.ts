import { AuthService } from "./application/services/Auth.service";
import { UserRepository } from "./infrastructure/repositories/UserRepository";
import { AuthController } from "./presentation/controllers/Auth.controller";
import { AuthRoutes } from "./presentation/routes/auth.routes";

export const createAuthModule = () => {
  const userRepository = new UserRepository();
  const authService = new AuthService(userRepository);
  const authController = new AuthController(authService);
  const authRoutes = AuthRoutes.create(authController);

  return { authController, authService, authRoutes };
};
