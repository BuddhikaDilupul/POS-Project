import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config"; // Adjust path if needed
import { sendResponse } from "../utils/response";
import httpStatus from "http-status";

interface DecodedToken {
  role: string;
  id: string;
  username: string;
  email: string;
}

// Extend Express Request interface to include custom properties
declare global {
  namespace Express {
    interface Request {
      role?: string;
      userId?: string;
      email?: string;
      username?: string;
    }
  }
}

export const authenticate = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      sendResponse(
        res,
        httpStatus.UNAUTHORIZED,
        "Authorization token missing"
      );
      return 
    }

    // Verify and decode the token
    const decodedToken = jwt.verify(token, config.secret);

    // Ensure the decoded token matches the DecodedToken interface
    if (typeof decodedToken === "object" && decodedToken !== null) {
      const { role, id, username, email } = decodedToken as DecodedToken;
      req.role = role;
      req.userId = id;
      req.username = username;
      req.email = email;

      next();
    } else {
      throw new Error("Invalid token structure");
    }
  } catch (error) {
    sendResponse(
      res,
      httpStatus.UNAUTHORIZED,
      "Invalid token"
    );
    return
  }
};
