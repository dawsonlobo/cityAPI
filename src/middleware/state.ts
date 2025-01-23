import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    const errorMsg = firstError.msg || 'Invalid input';
    const field = firstError.path || 'unknown field';
    
    res.status(400).json({
      statusCode: 400,
      data: 'Invalid input parameters',
      message: `Validation failed. ${field}: ${errorMsg}`,
    });
    return;
  }
  
  next();
};
