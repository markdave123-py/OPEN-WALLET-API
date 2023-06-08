import { User } from '../models/user';
import bcrypt from 'bcrypt';
import { ForbiddenError, SERVER_ERROR } from '../commonErrors/Errors/Errors';
import { HttpStatusCodes } from '../commonErrors/httpCode'
import { ControllerArgs } from '../types';
import { NextFunction, Request, Response } from 'express';

export const createNewUser = async (req: Request, res: Response, next: NextFunction)=>{
    const {email, password, firstName, lastName} = req.body ;

    if (!email || !firstName || !lastName || !password) {
        
        throw new ForbiddenError("Provide the required credentials!!");

    }

    let userExist = await User.findOne({where:{email: email}})

    if (userExist){
        res.status(403).json({"message":"User with this email already exists!!"})
        throw new ForbiddenError("User with email already exists!!");
    }
        const hashedPassword = await bcrypt.hash(password, 10); 
    
        let user = await User.create({
            email,
            firstName,
            lastName,
            password: hashedPassword
        });

        user = await user.save();
        const { dataValues } = user;

        delete dataValues.password;

        return res.json({
            code: HttpStatusCodes.CREATED,
            message: "user successfully created",
            data: dataValues
    })
    
}

