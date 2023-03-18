import { Router } from "express";
import { controllerHandler } from "../middlewares/controllerHandler";
import { transerSchema } from "../validation/schemas/schemas";
import { getAllTransactions } from "../controllers/transactionController";
import { generatePdf } from "../controllers/homeControllers";

export const transactionRouter = Router()

transactionRouter.get('/wallet/:id/transactions', controllerHandler(getAllTransactions));
transactionRouter.get('/wallet/:id/transactions/download', controllerHandler(generatePdf));