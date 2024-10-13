import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { sendResponse } from "../utils/response";

// Define a custom error interface that extends the built-in Error interface
interface CustomError extends Error {
  name: string; // Ensure 'name' is always a string
  details?: any; // Add details for validation error information
}

// Error handling middleware
export const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.log(err.name);

  // Handle unauthorized errors
  if (err.name === "UnauthorizedError") {
    sendResponse(res, httpStatus.UNAUTHORIZED, err.message);
    return;
  }

  // Handle validation errors
  if (err.name === "ValidationError") {
    const errorMessages = err.details?.body?.map(
      (detail: any) => detail.message
    ) || ["Validation Failed"];
    sendResponse(res, httpStatus.UNPROCESSABLE_ENTITY, errorMessages);
    return;
  }

  // Handle other errors
  sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, err.message);
    return;
};
