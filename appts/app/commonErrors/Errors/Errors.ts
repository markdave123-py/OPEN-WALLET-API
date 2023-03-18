import { HttpStatusCodes } from "../httpCode";
import { ApiError } from "./ApiErrors";


export class ConflictError extends ApiError {

    _message: string;
    _name: string;
    _statusCode: number;

    constructor(msg: string) {
        super(msg);
        this._name = "CONFLICT_ERROR";
        this._message = msg;

        this._statusCode = HttpStatusCodes.CONFLICT;

        Object.setPrototypeOf(this, ConflictError.prototype);
    }
}

export class ForbiddenError extends ApiError{
    _message: string;
    _name: string;
    _statusCode: number;

    constructor(msg: string) {
        super(msg);
        this._name = "Forbidden_ERROR";
        this._message = msg;

        this._statusCode = HttpStatusCodes.FORBIDDEN;

        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }

}

export class UNAUTHORIZED_ERROR extends ApiError{
    _message: string;
    _name: string;
    _statusCode: number;

    constructor(msg: string) {
        super(msg);
        this._name = "Unauthorized";
        this._message = msg;

        this._statusCode = HttpStatusCodes.UNAUTHORIZED;

        Object.setPrototypeOf(this, UNAUTHORIZED_ERROR.prototype);
    }

}

export class SERVER_ERROR extends ApiError{
    _message: string;
    _name: string;
    _statusCode: number;

    constructor(msg: string) {
        super(msg);
        this._name = "SERVER_ERROR";
        this._message = msg;

        this._statusCode = HttpStatusCodes.SERVER_ERROR;

        Object.setPrototypeOf(this, SERVER_ERROR.prototype);
    }

}

export class NOT_FOUND extends ApiError{
    _message: string;
    _name: string;
    _statusCode: number;

    constructor(msg: string) {
        super(msg);
        this._name = "NOT FOUND";
        this._message = msg;

        this._statusCode = HttpStatusCodes.NOT_FOUND;

        Object.setPrototypeOf(this, NOT_FOUND.prototype);
    }

}