import { Router } from "express";
import { controllerHandler } from "../middlewares/controllerHandler";
import { transerSchema } from "../validation/schemas/schemas";
import { makeTransfer, getAllTransfers, getOneTransfer } from "../controllers/transferController";

export const transerRouter = Router()

transerRouter.post('/wallet/:id/transfers', controllerHandler(makeTransfer, transerSchema));
transerRouter.get('/wallet/:id/transfers', controllerHandler(getAllTransfers));
transerRouter.get('/wallet/:wallet_id/transfers/:id', controllerHandler(getOneTransfer));

