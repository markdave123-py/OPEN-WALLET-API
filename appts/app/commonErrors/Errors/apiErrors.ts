export abstract class ApiError extends Error {

    abstract _message: string;
    abstract _name: string;
    abstract _statusCode: number;

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, ApiError.prototype);
    }

    get name(): string {
        return this._name;
    }

    get message(): string {
        return this._message
    }

    get statusCode(): number {
        return this._statusCode;
    }
}