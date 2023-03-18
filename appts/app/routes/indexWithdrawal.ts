import { Router } from "express";
import { controllerHandler } from "../middlewares/controllerHandler";
import { depositIntoWalletSchema } from "../validation/schemas/schemas";
import { makeWithdrawal, getAllWithdrawals, getOneWithdrawal} from "../controllers/withdrawController"; 

export const withdrawalRouter = Router();

withdrawalRouter.post('/wallet/:id/withdrawals', controllerHandler(makeWithdrawal, depositIntoWalletSchema));
withdrawalRouter.get('/wallet/:id/withdrawals', controllerHandler(getAllWithdrawals));
withdrawalRouter.get('/wallet/:walletId/withdrawals/:id', controllerHandler(getOneWithdrawal));