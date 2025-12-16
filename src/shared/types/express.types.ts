import { Request, Response, NextFunction } from "express";

export interface TypedRequest<
  TBody = unknown,
  TQuery = unknown,
  TParams = unknown
> extends Request<TParams, any, TBody, TQuery> {
  body: TBody;
  query: TQuery;
  params: TParams;
  user?: AuthenticatedUser;
}

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: string;
}

export type TypedResponse<TData = unknown> = Response<ApiResponse<TData>>;

export interface ApiResponse<TData = unknown> {
  success: boolean;
  data?: TData;
  message?: string;
  errors?: ValidationError[];
  meta?: ResponseMeta;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ResponseMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export type AsyncRequestHandler<
  TBody = unknown,
  TQuery = unknown,
  TParams = unknown,
  TData = unknown
> = (
  req: TypedRequest<TBody, TQuery, TParams>,
  res: TypedResponse<TData>,
  next: NextFunction
) => Promise<void>;
