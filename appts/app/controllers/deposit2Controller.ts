import { converter } from '../utils/exchangeRate';
import { Wallet } from '../models/wallet';
import { Deposit } from '../models/deposit';
import { dollarRate } from '../utils/utils';

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

        let wallet = await Wallet.findOne({where:{id: walletId}});

        if (amount < 0){
            res.status(403).json("you can't deposit an amount less than zero");

        }

        if(!wallet){
                res.status(404).json({"message": "NO wallet with the specified id  or You did not create the wallet with this id"});
        }

        currency = currency.toLowerCase()

        let walletCurrency = wallet!.currency.toLowerCase()

        try {

            let response: any

            if (currency !== walletCurrency){
                response = await converter.getConversion(currency, walletCurrency, amount);
                
                let convertedAmount = response.result
                updatedWallet = await wallet?.update(
                    { amount: wallet?.amount + convertedAmount },
                    { where: { id: walletId}}
                )
                
            }

            if( currency === walletCurrency){

                updatedWallet = await wallet?.update(
                    { amount: wallet?.amount + amount },
                    { where: { id: walletId}}
                )

            }

           

            
        } catch (error) {

            console.log(error)
            res.status(500).json("internal server error!!")
            
        }



        const acceptedCurrencies = ['naira' ,'dollar']


    if (!acceptedCurrencies.includes(currency)){
        res.status(403).json("You can only create a Naria and Dollar account with us thanks");
        
    }

        

        



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
            return res.status(404).json({"message": "pls specify the id of the wallet"});
            
        } 

        // const wallet = await Wallet.findAll({where:
        //                                     {UserId: await getUserId(),
        //                                         id: walletId
        //                                     }});

        // let wallet = wallets.find((wallet: any)=> {
        //     return wallet.id === walletId });

        // if(!wallet){
        //         res.status(404).json({"message": "NO wallet with the specified id or you did not create this wallet"});
        //         throw new NOT_FOUND("NO wallet with the specified id");
        //     }
        const requiredDeposits = await Deposit.findAll({where:{WalletId: walletId}});

        // const requiredDeposits = deposits.filter((deposit: any)=> {
        //     return deposit.WalletId === walletId })
        
        if(!requiredDeposits){
            return res.status(404).json({"message": "No deposit with specified id "})     
            }

        return res.json({
            code: HttpStatusCodes.OK,
            data: requiredDeposits
        })

}

export const getOneDeposit = async(req: Request, res: Response, next: NextFunction) => {
        const depositId = req.params.id
        const walletId = req.params.wallet_id

        if (!depositId || !walletId) return res.status(404).json({"message": "pls specify the id of the wallet and deposit"})

        // const wallets = await Wallet.findAll({where:{UserId: await getUserId()}})

        // if (wallets.length === 0) return res.json({'message':'you dont have a wallet, create one deposit then you can get a deposit'})
        
        // let wallet = await Wallet.findOne({where:{id: walletId}});
        // const wallet = wallets.filter((card)=>{ return card.id === walletId});

        // if(wallet.length === 0) return res.json({'message':'no wallet with this id created by this user'})
        const requiredDeposit = await Deposit.findOne({where:{id: depositId}});

        // const deposits = await Deposit.findAll();

        // const requiredDeposits = deposits.filter((deposit: any)=> {
        //     return deposit.WalletId === walletId })

        // const requiredDeposit = requiredDeposits.filter((deposit: any ) => {
        //     return deposit.id === depositId 
        // })

        if(!requiredDeposit){
            return res.status(404).json({"message": "No deposit with specified id "})     
        }

        return res.json({
            code: HttpStatusCodes.OK,
            data: requiredDeposit
        })

    }
