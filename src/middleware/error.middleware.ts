import { Request, Response } from "express";

export const errorHandler = (error: Error, req: Request, res: Response) => {
  console.error(error.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
};
