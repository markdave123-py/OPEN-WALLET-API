import { Wallet } from '../models/wallet';
import { getUserId } from '../utils/utils';
import { Transfer } from '../models/transfer';
import { Deposit } from '../models/deposit';
import { Withdrawal } from '../models/withdrawal.';

import { NextFunction, Request, Response } from 'express';


export let Transaction:any
export let data:any

export const getAllTransactions = async (req: Request, res:Response, next: NextFunction) => {

    const walletId = req.params.id

    const wallet = await Wallet.findOne({where:{UserId: await getUserId(), id:walletId}});
    


    // let wallet = wallets.find((wallet: any) => {
    //     return wallet.id === walletId
    //     }) 

    if (!wallet){
        return res.status(404).json({"message": "No wallet with specified id from this user "});
        }

    const requiredwithdrawals = await Withdrawal.findAll({where:{WalletId:walletId}});

    // const requiredwithdrawals = withdrawals.filter((withdrawal: any)=> {
    //     return withdrawal.WalletId === walletId 
    //     })

    const requiredTransfers = await Transfer.findAll({where:{WalletId:walletId}});

    // const requiredTransfers = transfers.filter((Transfer: any)=> {
    //     return Transfer.WalletId === walletId })

    const requiredDeposits = await Deposit.findAll({where:{WalletId:walletId}});

    // const requiredDeposits = deposits.filter((deposit: any)=> {
    //     return deposit.WalletId === walletId })

    if (!requiredDeposits && !requiredTransfers && !requiredwithdrawals){
        res.json({"message": "You have no transactions!!"})
    }

    Transaction = {
        Deposits: requiredDeposits,
        Withdrawals: requiredwithdrawals,
        Transfers: requiredTransfers 
    }

    data = [
        requiredDeposits,
        requiredwithdrawals,
        requiredTransfers 
    ]


    return res.json({
        Transaction
    })

}




