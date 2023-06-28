import { getUserId } from '../utils/utils';
import { Wallet } from '../models/wallet';
import { Deposit } from '../models/deposit';
import { dollarRate } from '../utils/utils';
import { NOT_FOUND, ForbiddenError} from '../commonErrors/Errors/Errors';
import { HttpStatusCodes } from '../commonErrors/httpCode';
import { NextFunction, Request, Response } from 'express';


Wallet.hasMany(Deposit);

export let  walletId : any

let updatedWallet : any

export const makeDeposit = async(req:Request, res: Response, next: NextFunction) => {
        walletId = req.params.id;
        let currency = req.body.currency
        const amount = req.body.amount

        if (!currency || !amount ){
            return res.status(403).json({"message":"Provide the currency and amount to be deposited"});
        }
        currency = currency.toLowerCase()

        const acceptedCurrencies = ['naira' ,'dollar']

    if (!acceptedCurrencies.includes(currency)){
        res.status(403).json("You can only create a Naria and Dollar account with us thanks");

    }

        if (amount < 0){
            res.status(403).json("you can't deposit an amount less than zero");
            
        }

        let wallet = await Wallet.findOne({where:{id: walletId}});
    

        if(!wallet){
                res.status(404).json({"message": "NO wallet with the specified id  or You did not create the wallet with this id"});
                
            }

        let walletCurrency = wallet!.currency.toLowerCase()


    if ( currency === walletCurrency){
        updatedWallet = await wallet?.update(
            { amount: wallet?.amount + amount },
            { where: { id: walletId}}
        )
    }


    if (currency === "naira" && walletCurrency === "dollar"){
        updatedWallet = await wallet?.update(
            { amount: wallet?.amount + (amount / dollarRate)},
            { where: { id: walletId}}
    )}

    if (currency === "dollar" && walletCurrency === "naira"){
        updatedWallet = await wallet?.update(
            { amount: wallet?.amount + (amount * dollarRate) },
            { where: { id: walletId}}
    )}


    let deposit = await Deposit.create({
                currency,
                amount,
                WalletId: walletId
            })

        await deposit.save();

        return res.json({
            code: HttpStatusCodes.OK,
            data: updatedWallet
        })

    }


export const getAllDeposit = async(req: Request, res: Response, next: NextFunction) => {
        const walletId = req.params.id;

        if(!walletId){
            return res.status(404).json({"message": "pls specify the id of the wallet"})
            
        } 

        const wallets = await Wallet.findAll({where:{UserId: await getUserId()}});

        let wallet = wallets.find((wallet: any)=> {
            return wallet.id === walletId });

        if(!wallet){
                res.status(404).json({"message": "NO wallet with the specified id or you did not create this wallet"});
               
            }
        const deposits = await Deposit.findAll();

        const requiredDeposits = deposits.filter((deposit: any)=> {
            return deposit.WalletId === walletId })
        
        if(!requiredDeposits){
            return res.status(404).json({"message": "No deposit with specified id "})     
            }

        return res.json({
            code: HttpStatusCodes.OK,
            data: requiredDeposits
        })

}

export const getOneDeposit = async(req: Request, res: Response, next: NextFunction) => {
        const depostId = req.params.id
        const walletId = req.params.wallet_id

        if (!depostId || !walletId) return res.status(404).json({"message": "pls specify the id of the wallet and deposit"})

        const wallets = await Wallet.findAll({where:{UserId: await getUserId()}})

        if (wallets.length === 0) return res.json({'message':'you dont have a wallet, create one deposit then you can get a deposit'})
        
        
        const wallet = wallets.filter((card)=>{ return card.id === walletId});

        if(wallet.length === 0) return res.json({'message':'no wallet with this id created by this user'})

        const deposits = await Deposit.findAll();

        const requiredDeposits = deposits.filter((deposit: any)=> {
            return deposit.WalletId === walletId })

        const requiredDeposit = requiredDeposits.filter((deposit: any ) => {
            return deposit.id === depostId 
        })

        if(!requiredDeposits){
            return res.status(404).json({"message": "No deposit with specified id "})     
        }

        return res.json({
            code: HttpStatusCodes.OK,
            data: requiredDeposit
        })

}