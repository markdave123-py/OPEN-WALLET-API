import { User } from '../models/user';
import  jwt, { decode }  from 'jsonwebtoken';
import dotenv from "dotenv";
import bcrypt from "bcrypt"
import { NextFunction, Request, Response } from 'express';
import { ForbiddenError, NOT_FOUND, UNAUTHORIZED_ERROR } from '../commonErrors/Errors/Errors';


dotenv.config();

export const handleLogin = async (req:Request, res:Response, next: NextFunction) =>{
    const {email, password} = req.body;

    if (!email || !password) return res.status(400).json({"message": "Email and password required!!"});
    
    const users = await User.findAll();
    const user = users.find((person:any) => person.email === email );

    if(!user) {
        res.status(404).json({"message": `No user with this email ${ email } please register then you can login`})
        throw new NOT_FOUND("No user with this email please register then you can login");}

    const match = await bcrypt.compare(password, user.password);

    if(match) {
        const accessToken = jwt.sign(
            {"username": user.email},
            `${process.env.ACCESS_TOKEN_SECRET}`,
            {"expiresIn": "60s"}
        );
        // console.log(res);
        
        res.json({"accessToken": accessToken});
    }else{
        res.sendStatus(401);
    }
}

export let userEmail :any

export const verifyJwt =  (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        res.status(401).json({"message": "pls provide access token"})
        throw new UNAUTHORIZED_ERROR("User Unauthorized");}
    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        `${process.env.ACCESS_TOKEN_SECRET}`,
        (err: any, decoded: any)=>{
            if(err) {
                res.json({'message': 'Could not verify token try again later!!!'})
                throw new ForbiddenError("Could not verify token try again later!!!")};
            userEmail = decoded.username;
           next();
        }   
    )
    
    
}



