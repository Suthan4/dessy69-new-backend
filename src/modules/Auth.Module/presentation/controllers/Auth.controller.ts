import { Request, Response } from "express";
import { IAuthService } from "../../application/DTOs/IAuthService";
import { LoginDTO, RegisterDTO } from "../../application/DTOs/AuthDTO";

export class AuthController {
  constructor(private authService: IAuthService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const reqbody = new RegisterDTO(
        req.body.email,
        req.body.password,
        req.body.name,
        req.body.phone,
        req.body.address
      );
      const result = await this.authService.register(reqbody);
      res.status(201).json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const reqbody = new LoginDTO(req.body.email, req.body.password);
      const result = await this.authService.login(reqbody);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(401).json({ success: false, message: error.message });
    }
  };
}
