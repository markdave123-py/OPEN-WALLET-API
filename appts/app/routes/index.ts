import { Router } from "express";
import { handleLogin } from "../controllers/authUserController"
import { createNewUserSchema, userLoginSchema, createNewWalletSchema } from "../validation/schemas/schemas";
import { createNewUser } from "../controllers/userController";
import { controllerHandler } from "../middlewares/controllerHandler";


export const router = Router();

router.post('/auth/users', controllerHandler(createNewUser, createNewUserSchema));
router.post('/auth/users/login', controllerHandler(handleLogin, userLoginSchema));

