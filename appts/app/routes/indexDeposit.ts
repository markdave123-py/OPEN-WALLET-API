import { Router } from "express";
import { controllerHandler } from "../middlewares/controllerHandler";
import { makeDeposit } from "../controllers/depositController";
import { depositIntoWalletSchema } from "../validation/schemas/schemas";
import { getAllDeposit, getOneDeposit } from "../controllers/depositController";

export const depositRouter = Router();

depositRouter.post('/wallet/:id/deposits', controllerHandler(makeDeposit, depositIntoWalletSchema));
depositRouter.get('/wallet/:id/deposits', controllerHandler(getAllDeposit));
depositRouter.get('/wallet/:wallet_id/deposits/:id', controllerHandler(getOneDeposit));