import express, {Request,Response, NextFunction } from "express";
import {config} from "./config/env";
import { myDatabase } from "./config/database";
import serveStatic from 'serve-static';
import cors from 'cors';
import { router } from "./routes";
import { routerWallet } from "./routes/indexWallet";
import { verifyJwt } from "./controllers/authUserController";
import { depositRouter } from "./routes/indexDeposit";
import { withdrawalRouter } from "./routes/indexWithdrawal";
import { transerRouter } from "./routes/indexTransfer";
import { transactionRouter } from "./routes/indexTransaction";
import path from 'path';
import expressLayout from "express-ejs-layouts"
import {pdfRouter} from "./routes/pdf";



export const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.use(expressLayout);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(serveStatic(path.join(__dirname, 'public')));
app.use('/docs', express.static(path.join(__dirname, 'docs')))
app.use(pdfRouter);


app.use('/', router);


app.use(verifyJwt);
app.use('/', routerWallet );
app.use('/', depositRouter );
app.use('/', withdrawalRouter);
app.use('/', transerRouter);
app.use('/', transactionRouter);

app.use('*', ( req: Request, res: Response, next: NextFunction) => {
    // console.log(req.route)
    res.status(404).json({
        message: 'route not found'
    });
});


myDatabase.sync().then(() => {
    console.log("connection to database successful");
    app.listen(config.port, () => {
        console.log(`Server running on port ${config.port}`);
    });
})


