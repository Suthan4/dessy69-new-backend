import { Router } from "express";
import { validate } from "../middleware/validation.middleware";
import { AuthService } from "@/application/services/Auth.service";
import { UserRepository } from "@/infrastructure/database/repositories/UserRepository";
import { LoginSchema, RegisterSchema } from "../validators/schema";

export class AuthRoutes {
  public router: Router;
  private authService: AuthService;

  constructor() {
    this.router = Router();
    const userRepository = new UserRepository();
    this.authService = new AuthService(userRepository);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post(
      "/register",
      validate(RegisterSchema),
      async (req, res) => {
        try {
          const result = await this.authService.register(req.body);
          res.status(201).json({ success: true, data: result });
        } catch (error: any) {
          res.status(400).json({ success: false, message: error.message });
        }
      }
    );

    this.router.post("/login", validate(LoginSchema), async (req, res) => {
      try {
        const result = await this.authService.login(req.body);
        res.json({ success: true, data: result });
      } catch (error: any) {
        res.status(401).json({ success: false, message: error.message });
      }
    });

    this.router.get("/verify", async (req, res) => {
      try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
          return res.status(401).json({ success: false, message: "No token" });
        }

        const user = await this.authService.verifyToken(token);
        res.json({ success: true, data: user });
      } catch (error: any) {
        res.status(401).json({ success: false, message: error.message });
      }
    });
  }
}
