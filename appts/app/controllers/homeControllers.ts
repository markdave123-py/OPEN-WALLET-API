import fs from 'fs'; 
//@ts-ignore
import * as pdf from 'pdf-creator-node';
import path from 'path'
import { Request, Response, NextFunction } from 'express';
import { options } from '../helpers/options';
import { extractDate } from '../utils/utils';
import { Wallet } from '../models/wallet';
import { getUserId } from '../utils/utils';
import { Transfer } from '../models/transfer';
import { Deposit } from '../models/deposit';
import { Withdrawal } from '../models/withdrawal.';


export const homeVeiw = (req:Request, res:Response, next:NextFunction) => {
    res.render('home');
}

export const generatePdf = async (req:Request, res:Response, next:NextFunction) => {

    const walletId = req.params.id

    const wallets = await Wallet.findAll({where:{UserId: await getUserId()}});
    if (wallets.length === 0) return res.json({'message':'you dont have a wallet, create one, deposit the you can withdraw' })


    let wallet = wallets.find((wallet: any) => {
        return wallet.id === walletId
        }) 

    if (!wallet){
        res.status(404).json({"message": "No wallet with specified id from this user"});
        }

    const withdrawals = await Withdrawal.findAll();

    const requiredwithdrawals = withdrawals.filter((withdrawal: any)=> {
        return withdrawal.WalletId === walletId 
        })

    const transfers = await Transfer.findAll();

    const requiredTransfers = transfers.filter((Transfer: any)=> {
        return Transfer.WalletId === walletId })

    const deposits = await Deposit.findAll();

    const requiredDeposits = deposits.filter((deposit: any)=> {
        return deposit.WalletId === walletId })


    let data = [
        requiredDeposits,
        requiredwithdrawals,
        requiredTransfers 
    ]


    const html = fs.readFileSync(path.join(__dirname, '../views/template.html'), 'utf-8');
    const fileName = Math.random() + '_doc' + '.pdf';

    let array:any  = [];

    data[0].forEach((deposit:any) => {
        let createdAt = extractDate(JSON.stringify((deposit.createdAt)));
        const DEPOSIT = {
            name: "DEPOSIT",
            id: deposit.id,
            currency: deposit.currency,
            amount: deposit.amount,
            createdAt: createdAt,
            WalletId: deposit.WalletId
        }
        array.push(DEPOSIT)
        
    });

    data[1].forEach((withdrawal:any) => {
        let createdAt = extractDate(JSON.stringify((withdrawal.createdAt)));
        const WITHDRAWAL = {
            name: "WITHDRAWAL",
            id: withdrawal.id,
            currency: withdrawal.currency,
            amount: withdrawal.amount,
            createdAt: createdAt,
            WalletId: withdrawal.WalletId
        }
        array.push(WITHDRAWAL)
        
    });
    data[2].forEach((transfer:any) => {
        let createdAt = extractDate(JSON.stringify((transfer.createdAt)).substring(0,20).replace('T', '||'));
        const TRANSFER = {
            name: "TRANSFER",
            id: transfer.id,
            currency: transfer.currency,
            amount: transfer.amount,
            createdAt: createdAt,
            WalletId: transfer.WalletId
        }
        array.push(TRANSFER)
        
    });
    const obj = {
        prodlist: array ,
        name: 'Transactions'
    }

    const document ={
        html: html,
        data:{
            products: obj
        }, 
        path: './app/docs/' + fileName
    }
    
    pdf.create(document, options)
    .then( (res:any) => {
        console.log(res);
    }).catch((error:any) => {
        console.log(error)
    });

    const filePath = 'http://localhost:3500/app/docs/' + fileName;
    console.log(__dirname)
    res.render('download',{ 
        path: filePath}
    )

}
