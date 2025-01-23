import { Request } from 'express';

export interface CustomRequest extends Request {
  customReq?: {
    statusCode: number,
    data: any;
    message: string;
  };
}
