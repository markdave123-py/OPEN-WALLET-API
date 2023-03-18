import { Router } from "express";
import { createNewWalletSchema} from "../validation/schemas/schemas";
import { controllerHandler } from "../middlewares/controllerHandler";
import { createNewWallet, getWallets } from "../controllers/walletController";
import { getWalletById, deleteWallet} from "../controllers/walletController";

export const routerWallet = Router();

routerWallet.post('/wallet', controllerHandler(createNewWallet, createNewWalletSchema));
routerWallet.get('/wallet', controllerHandler(getWallets));
routerWallet.get('/wallet/:id', controllerHandler(getWalletById));
routerWallet.delete('/wallet/:id', controllerHandler(deleteWallet));
// routerWallet.post('/wallet/:id', controllerHandler(depositIntoWallet, depositIntoWalletSchema));