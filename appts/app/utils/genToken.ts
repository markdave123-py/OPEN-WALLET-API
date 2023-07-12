import  jwt, { decode,sign }  from 'jsonwebtoken';


export const genToken = (userEmail: string) => {
    const accessToken = jwt.sign(
        {"username": userEmail},
        `${process.env.ACCESS_TOKEN_SECRET}`,
        {"expiresIn": "6000000s"}
    );
    return accessToken
}
