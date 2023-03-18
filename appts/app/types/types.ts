import { Request, Response, NextFunction } from "express";
export type ExpressCallBackFunction =  (req: Request, res: Response, next: NextFunction) => void;

export type AnyFunction = (...args: any[]) => any;