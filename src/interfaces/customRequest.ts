import { Request } from 'express';

export interface CustomRequest extends Request {
  customReq?: {
    isSuccessful: boolean;
    data: any;
    message: string;
  };
}
