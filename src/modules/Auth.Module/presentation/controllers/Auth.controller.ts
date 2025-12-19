import { Request, Response } from "express";
import { IAuthService } from "../../application/DTOs/IAuthService";
import { LoginDTO, RegisterDTO } from "../../application/DTOs/AuthDTO";
import { AppConfig } from "@/config/app.config";

export class AuthController {
  constructor(private authService: IAuthService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const reqbody = new RegisterDTO(
        req.body.email,
        req.body.password,
        req.body.name,
        req.body.role,
        req.body.phone,
        req.body.address
      );
      const result = await this.authService.register(reqbody);
      res.cookie("token", result.token, {
        httpOnly: true, // Can be true for better security
        sameSite: "none", // ✅ Correct for cross-origin HTTPS
        secure: true, // ✅ Required for HTTPS
        domain: ".dessy69.in",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(201).json({ success: true, data: result.user });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const reqbody = new LoginDTO(req.body.email, req.body.password);
      const result = await this.authService.login(reqbody);
      res.cookie("token", result.token, {
        httpOnly: true, // Can be true for better security
        sameSite: "none", // ✅ Correct for cross-origin HTTPS
        secure: true, // ✅ Required for HTTPS
        domain: ".dessy69.in",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({ success: true, data: result.user });
    } catch (error: any) {
      res.status(401).json({ success: false, message: error.message });
    }
  };
}
