import { converter } from '../utils/exchangeRate';
import _fetch from 'isomorphic-fetch';
import { Wallet } from '../models/wallet';
import { Deposit } from '../models/deposit';
import { getUserId } from '../utils/utils';


import { HttpStatusCodes } from '../commonErrors/httpCode';
import { NextFunction, Request, Response } from 'express';


Wallet.hasMany(Deposit);

export let  walletId : any

let updatedWallet : any


export const makeDeposit = async(req:Request, res: Response, next: NextFunction) => {

        walletId = req.params.id;
        let currency = req.body.currency
        const amount = req.body.amount

        
        if (!currency || !amount ) return res.status(400).json({"message":"Provide the currency and amount to be deposited"});
        
        console.log('wallet error')
        if (amount < 0) return res.status(403).json({"message":"you can't deposit an amount less than or equal to zero"});

        let wallet = await Wallet.findOne({where:{id: walletId}});

        if(!wallet){
            return res.status(404).json({"message": "NO wallet with the specified id  or You did not create the wallet with this id"});
        }

        currency = currency.toLowerCase()

        let walletCurrency = wallet!.currency.toLowerCase()

    

            try{
                let response = currency !== walletCurrency
                ? await converter.getConversion(currency, walletCurrency, +amount)
                : "";

                const convertedAmount = response.result ?? amount

                console.log(convertedAmount)


                updatedWallet = await wallet?.update(
                    { amount: wallet?.amount + convertedAmount },
                    { where: { id: walletId}}
                )

            }catch (err) {
            console.log(err);
            res.status(500).json({"message": "internal server error!!"});
        }



    let deposit = await Deposit.create({
                currency,
                amount,
                WalletId: walletId
            })

        await deposit.save();

        return res.json({
            code: HttpStatusCodes.CREATED,
            data: updatedWallet
        })

    

}


        

export const getAllDeposit = async(req: Request, res: Response, next: NextFunction) => {
        const walletId = req.params.id;

        if(!walletId){
            return res.status(404).json({"message": "pls specify the id of the wallet"});
            
        } 

        const wallet = await Wallet.findAll({where:
                                            {UserId: await getUserId(),
                                                id: walletId
                                            }});


        if(!wallet){
                res.status(404).json({"message": "NO wallet with the specified id or you did not create this wallet"});
            
            }
        const requiredDeposits = await Deposit.findAll({where:{WalletId: walletId}});

        
        
        if(!requiredDeposits){
            return res.status(404).json({"message": "No deposit with specified id"})     
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

        const requiredDeposit = await Deposit.findOne({where:{id: depositId}});

        

        if(!requiredDeposit){
            return res.status(404).json({"message": "No deposit with specified id "})     
        }

        return res.json({
            code: HttpStatusCodes.OK,
            data: requiredDeposit
        })

    }
