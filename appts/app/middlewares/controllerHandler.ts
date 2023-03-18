import { NextFunction, Request, Response } from "express";
import {  ValidationSchema } from "../types/interface";
import { AnyFunction } from "../types/types";
import { ExpressCallBackFunction } from "../types/types";
import { validateIncomingRequest } from "../validation/joiValidation";


const parseControllerArgs = (req: Request) => {
    return {
        body: req.body,
        params: req.params,
        query: req.query,
    }
}

export const controllerHandler = (controllerFunc: AnyFunction, schema: ValidationSchema | undefined = {}): ExpressCallBackFunction  => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const controllerArgs = parseControllerArgs(req);
        const { body, params, query } = controllerArgs;

        try{

            if(schema) {
                const { bodySchema, paramsSchema, querySchema } = schema;

                try{
                    if(bodySchema)
                        validateIncomingRequest(bodySchema, body);
                    if(paramsSchema)
                        validateIncomingRequest(paramsSchema, params);
                    if(querySchema)
                        validateIncomingRequest(querySchema, query);
                }catch(err: any) {
                    console.error(err.message);
                }
            }
 
            const result = await controllerFunc(req, res, next);
            // console.log(result)
            // if(!result) res.status(200).json({ status: "sucesss" });

            // const { code, ...others } = result;
            // res.status(code ?? 200).json(others);

        }catch(err) {
            console.log('error reaches here', err)
            next(err);
        }
    }
}