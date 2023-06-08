import { Wallet } from '../models/wallet';
import { getUserId } from '../utils/utils';
import { Withdrawal } from '../models/withdrawal.'; 
import { dollarRate } from '../utils/utils';
import { NOT_FOUND, ForbiddenError } from '../commonErrors/Errors/Errors';
import { HttpStatusCodes } from '../commonErrors/httpCode';
import { NextFunction, Request, Response } from 'express';

Wallet.hasMany(Withdrawal);


export const makeWithdrawal = async(req: Request, res: Response, next: NextFunction) => {
    
    const walletId = req.params.id
    const amount = req.body.amount
    let currency = req.body.currency

   

    currency = currency.toLowerCase()


    const acceptedCurrencies = ['naira' ,'dollar']

    if (!acceptedCurrencies.includes(currency)){
        res.status(403).json("You can only create a Naria and Dollar account with us thanks");
        throw new ForbiddenError("You can only create a Naria and Dollar account with us thanks");
    }

    if (amount < 0){
            res.status(403).json("you can't deposit an amount less than zero");
            throw new ForbiddenError("you can't deposit an amount less than zero")
        }

   
    const wallets = await Wallet.findAll({where:{UserId: await getUserId()}});

    if (wallets.length == 0){
        return res.json({'message': 'you dont have any wallet yet'})
    }

    let wallet = wallets.find((wallet: any) => {
        return wallet.id === walletId
    }) 

    if (!wallet){
        res.status(404).json({"message": "No wallet with specified id"});
    }

    let walletCurrency = wallet?.currency.toLowerCase()
    let walletAmount: any = wallet?.amount

    let updatedWallet: any

        if ( currency === walletCurrency){
            if ( amount > walletAmount){
                return res.json({"message": "INSUFFICIENT FUNDS"})
            }else{
                updatedWallet = await wallet?.update(
                    { amount: wallet?.amount - amount },
                    { where: { id: walletId}})
            }
            
        }
    
        if (currency === "naira" && walletCurrency === "dollar"){
            if( amount > (walletAmount * dollarRate)){
                return res.json({"message": "INSUFFICIENT FUNDS"})
            }else{
                updatedWallet = await wallet?.update(
                    { amount: wallet?.amount - (amount / dollarRate)},
                    { where: { id: walletId}}
                )
            }
        }
    
        if (currency === "dollar" && walletCurrency === "naira"){
            if( amount > (walletAmount / dollarRate)){
                return res.json({"message": "INSUFFICIENT FUNDS"})
            }else{
                updatedWallet = await wallet?.update(
                    { amount: wallet?.amount - (amount * dollarRate) },
                    { where: { id: walletId}}
                )
            }
        }
    
    
    
        let withdrawal = await Withdrawal.create({
            currency,
            amount,
            WalletId: walletId
        })
    
        await withdrawal.save();

        return res.json({
            code: HttpStatusCodes.OK,
            data: updatedWallet
        })
    
}

export const getAllWithdrawals = async(req: Request, res: Response, next: NextFunction) => {
    const walletId = req.params.id;

    if(!walletId){
        return res.status(404).json({"message": "pls specify the id of the wallet"})
        
    }
    const wallets = await Wallet.findAll({where:{UserId: await getUserId()}})

    if (wallets.length === 0) return res.json({'message':'you dont have a wallet, create one deposit then you can get a deposit'})


    let wallet = wallets.find((wallet: any)=> {
        return wallet.id === walletId });

    if(!wallet){
            res.status(404).json({"message": "NO wallet with the specified id or you did not create this wallet"});
            throw new NOT_FOUND("NO wallet with the specified id");
        }
        
    const withdrawals = await Withdrawal.findAll();

    const requiredwithdrawals = withdrawals.filter((withdrawal: any)=> {
        return withdrawal.WalletId === walletId })
    
    if(!requiredwithdrawals){
        return res.status(404).json({"message": "No withdrawals was made in this wallet "})     
        }

    return res.json({
        code: HttpStatusCodes.OK,
        data: requiredwithdrawals
    })

}  

export const getOneWithdrawal = async(req: Request, res: Response, next: NextFunction) => {
    const withdrawalId = req.params.id
    const walletId = req.params.walletId

    if (!withdrawalId || !walletId) return res.status(404).json({"message": "pls specify the id of the wallet and withdrawal"})

    const wallets = await Wallet.findAll({where:{UserId: await getUserId()}})

    if (wallets.length === 0) return res.json({'message':'you dont have a wallet, create one, deposit the you can withdraw' })

    const wallet = wallets.filter((card)=>{ return card.id === walletId});
    
    const withdrawals = await Withdrawal.findAll();

    if(wallet.length === 0) return res.json({'message':'no wallet with this id created by this user'})

    const requiredwithdrawals = withdrawals.filter((deposit: any)=> {
        return deposit.WalletId === walletId })

    const requiredwithdrawal = requiredwithdrawals.filter((deposit: any ) => {
        return deposit.id === withdrawalId 
    })

    if(requiredwithdrawal.length === 0){
        return res.status(404).json({"message": "No withdrawal with specified id "})     
    }

    return res.json({
        code: HttpStatusCodes.OK,
        data: requiredwithdrawal

    })

}




