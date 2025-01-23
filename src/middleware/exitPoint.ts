import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../interfaces/customRequest'; // Import the CustomRequest interface

export const exitPoint = (req: CustomRequest, res: Response, next: NextFunction): void => {
  // Check if customReq exists before destructuring
  if (req.customReq) {
    const { data, message } = req.customReq;  // Destructure only necessary fields

    // If customReq exists, respond with 200 status code
    res.status(200).json({
      statusCode: 200,  // Status code for success
      data,  // Send the data
      message,  // Send the message
    });
  } else {
    // If customReq is missing, send a 400 response
     res.status(400).json({
      statusCode: 400,  // Status code for error
      data: null,  // No data
      message: 'customReq data is missing in the request.',
    });
  }
};
