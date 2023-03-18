import { Request, Response } from "express";
import { ObjectSchema } from "joi";

function login(req: Request, res: Response) {
    req.body;
}

export interface ControllerArgs {
    body: any | undefined;
    query: any | undefined;
    params: any | undefined;
    files: any | undefined;
    users: any | null | undefined; //TODO: work on this.
}


export interface ValidationSchema {
    bodySchema?: ObjectSchema;
    querySchema?: ObjectSchema;
    paramsSchema?: ObjectSchema;
}