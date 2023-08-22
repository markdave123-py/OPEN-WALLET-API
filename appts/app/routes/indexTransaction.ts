import { Router } from "express";
import { controllerHandler } from "../middlewares/controllerHandler";
import { transerSchema } from "../validation/schemas/schemas";
import { getAllTransactions } from "../controllers/transaction2Controller";
import { generatePdf } from "../controllers/home2Controller";

export const transactionRouter = Router() 


transactionRouter.get('/wallet/:id/transactions', controllerHandler(getAllTransactions));
transactionRouter.get('/wallet/:id/transactions/download', controllerHandler(generatePdf));
