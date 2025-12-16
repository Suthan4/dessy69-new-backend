import { Router } from "express";

import { ValidationMiddleware } from "@/shared/middleware/validation.middleware";
import { AuthController } from "../controllers/Auth.controller";
import { LoginSchema, RegisterSchema } from "../../application/validators/auth.validator";;

export class AuthRoutes {
  static create(controller: AuthController): Router {
    const router = Router();
    router.post(
      "/register",
      ValidationMiddleware.validateBody(RegisterSchema),
      controller.register
    );
    router.post(
      "/login",
      ValidationMiddleware.validateBody(LoginSchema),
      controller.login
    );
    return router;
  }
}


