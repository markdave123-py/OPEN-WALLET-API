import { homeVeiw, generatePdf} from "../controllers/homeControllers";
import express from "express";
export const pdfRouter = express.Router();

pdfRouter.get('/pdf', generatePdf);
