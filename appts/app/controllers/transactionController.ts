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

    const wallets = await Wallet.findAll({where:{UserId: await getUserId()}});
    if (wallets.length === 0) return res.json({'message':'you dont have a wallet, create one, deposit the you can withdraw' })


    let wallet = wallets.find((wallet: any) => {
        return wallet.id === walletId
        }) 

    if (!wallet){
        res.status(404).json({"message": "No wallet with specified id from this user "});
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




