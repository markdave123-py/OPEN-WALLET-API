import {Schema } from "joi"


export const validateIncomingRequest = (schema: Schema, data: object) => {
    const { error, value  } = schema.validate(data);
    if(error) throw error;
    return value
}
