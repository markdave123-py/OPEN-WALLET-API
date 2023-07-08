import { sign } from "jsonwebtoken";

export const genToken = (userId: any) => {
    if (!userId) return new Error('user not defined');
    return sign({id: userId}, `${process.env.ACCESS_TOKEN_SECRET}`, {expiresIn: '600000s'});
}
