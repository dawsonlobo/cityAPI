import { Request, Response, NextFunction } from 'express';
import { ValidationError, validationResult } from 'express-validator';

export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Get the first error
    const firstError = errors.array()[0];
    
    // Extract error details
    const errorMsg = typeof firstError === 'object' && 'msg' in firstError 
      ? firstError.msg 
      : 'Invalid input';
    
    const field = 'path' in firstError 
      ? firstError.path as string 
      : 'unknown field';
    
    // Respond with only the first error
    res.status(400).json({
      statusCode: 400,
      data: 'Invalid input parameters',
      message: `Validation failed. ${field}: ${errorMsg}`,
    });
    return;
  }
  
  next();
};