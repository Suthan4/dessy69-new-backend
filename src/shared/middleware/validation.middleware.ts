import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

export class ValidationMiddleware {
  static validateBody(schema: z.ZodSchema) {
    return (req: Request, res: Response, next: NextFunction): void => {
      try {
        const validated = schema.parse(req.body);
        req.body = validated;
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          const errors = error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          }));
          res.status(400).json({
            success: false,
            message: "Validation error",
            errors,
          });
          return;
        }
        next(error);
      }
    };
  }

  static validateQuery(schema: z.ZodSchema) {
    return (req: Request, res: Response, next: NextFunction): void => {
      try {
        const validated = schema.parse(req.query);
        req.query = validated as any;
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          const errors = error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          }));
          res.status(400).json({
            success: false,
            message: "Query validation error",
            errors,
          });
          return;
        }
        next(error);
      }
    };
  }

  static validateParams(schema: z.ZodSchema) {
    return (req: Request, res: Response, next: NextFunction): void => {
      try {
        const validated = schema.parse(req.params);
        req.params = validated as any;
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          const errors = error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          }));
          res.status(400).json({
            success: false,
            message: "Parameter validation error",
            errors,
          });
          return;
        }
        next(error);
      }
    };
  }
}
