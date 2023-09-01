import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export interface ContentTransformerRequest {
  action: string;
  contentVersion: number;
  htmlContent: string;
  jsonContent: any;
}

export interface ContentTransformerResponse {
  contentVersion: number;
  htmlContent: string;
  jsonContent: any;
}