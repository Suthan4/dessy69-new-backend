import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../types/common.types";
import { AppConfig } from "@/config/app.config";

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: UserRole;
}

export class AuthMiddleware {
  static authenticate(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): void {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        res.status(401).json({ success: false, message: "No token provided" });
        return;
      }

      const decoded = jwt.verify(token, AppConfig.jwt.secret) as any;
      req.userId = decoded.userId;
      req.userRole = decoded.role;
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: "Invalid token" });
    }
  }

  static authorize(...roles: UserRole[]) {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
      if (!req.userRole || !roles.includes(req.userRole)) {
        res.status(403).json({ success: false, message: "Access denied" });
        return;
      }
      next();
    };
  }
}
