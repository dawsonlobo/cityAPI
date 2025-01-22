// import { Request, Response, NextFunction } from 'express';
// import { CustomRequest } from '../interfaces/customRequest'; // Import the CustomRequest interface

// export const exitPoint = (req: CustomRequest, res: Response, next: NextFunction): void => {
//   const { isSuccessful, data, message } = req.customReq || {};

//   if (isSuccessful !== undefined) {
//     res.status(isSuccessful ? 200 : 400).json({
//       isSuccessful,
//       data,
//       message,
//     });
//   } else {
//     res.status(500).json({
//       isSuccessful: false,
//       data: null,
//       message: 'Unknown error occurred.',
//     });
//   }
// };
import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../interfaces/customRequest'; // Import the CustomRequest interface

export const exitPoint = (req: CustomRequest, res: Response, next: NextFunction): void => {
  // Check if customReq exists before destructuring
  if (req.customReq) {
    const { isSuccessful, data, message } = req.customReq;

    // Send response based on isSuccessful flag
    if (isSuccessful !== undefined) {
      res.status(isSuccessful ? 200 : 400).json({
        isSuccessful,
        data,
        message,
      });
    } else {
      res.status(500).json({
        isSuccessful: false,
        data: null,
        message: 'Unknown error occurred.',
      });
    }
  } else {
    // If customReq doesn't exist, send a generic error response
    res.status(500).json({
      isSuccessful: false,
      data: null,
      message: 'No customReq data found in the request.',
    });
  }
};
