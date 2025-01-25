import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../interfaces/customRequest';

export const exitPoint = (req: CustomRequest, res: Response, next: NextFunction): void => {
  if (req.customReq) {
    const { status, data, message } = req.customReq;

    res.status(status).json({
      status,
      data,
      message,
    });
  } else {
    res.status(400).json({
      statusCode: 400,
      data: null,
      message: 'customReq data is missing in the request.',
    });
  }
};