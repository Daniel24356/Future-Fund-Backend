import { NextFunction, Request, Response } from "express";

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    const statusCode = (err as any).statusCode || 500;
    const message = (err as any).message || 'Internal Server Error';
    res.status(statusCode).json({error: message});
    console.error(err);
}