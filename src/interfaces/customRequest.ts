import { Request } from 'express';

export interface CustomRequest extends Request {
  customReq?: {
    status: number,
    data: any;
    message: string;
  };
}
