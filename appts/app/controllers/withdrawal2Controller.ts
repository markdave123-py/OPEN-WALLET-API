import { Wallet } from '../models/wallet';
import { converter } from '../utils/exchangeRate';
import { getUserId } from '../utils/utils';
import { Withdrawal } from '../models/withdrawal.'; 
import { HttpStatusCodes } from '../commonErrors/httpCode';
import { NextFunction, Request, Response } from 'express';

Wallet.hasMany(Withdrawal);


export const makeWithdrawal = async(req: Request, res: Response, next: NextFunction) => {
    
    const walletId = req.params.id
    const amount = req.body.amount
    let currency = req.body.currency

   

    currency = currency.toLowerCase()



    if (amount < 0){
            res.status(403).json("you can't deposit an amount less than zero");
            
        }

   
    const wallet = await Wallet.findOne({where:{UserId: await getUserId(),
                                                id:walletId
                                                }
                                                    });

    if (!wallet){
        return res.json({'message':"you can perform this operation only on a wallet created by you"})
    }

    // let wallet = wallets.find((wallet: any) => {
    //     return wallet.id === walletId
    // }) 

    if (!wallet){
        res.status(404).json({"message": "No wallet with specified id"});
    }

     let walletCurrency = wallet?.currency.toLowerCase()
     let walletAmount: any = wallet?.amount

     let updatedWallet: any
    
      


      try{
                let response = currency !== walletCurrency
                ? await converter.getConversion(currency, walletCurrency, +amount)
                : "";

                const convertedAmount = response.result ?? amount

                if (walletAmount < convertedAmount){
                    return res.status(403).json({"message": "Insufficient funds"})
                }else{
                    updatedWallet = await wallet?.update(
                    { amount: wallet?.amount - convertedAmount },
                    { where: { id: walletId}}
                )
                }
                

            }catch (err) {
            console.log(err);
            res.status(500).json({"message": "internal server error!!"});
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
    const wallet = await Wallet.findAll({where:
                                            {UserId: await getUserId(),
                                                id: walletId
                                            }})

    if (wallet.length === 0) return res.json({'message':'you did not create this wallet'})


    if(!wallet){
            return res.status(404).json({"message": "NO wallet with the specified id or you did not create this wallet"});
            
        }
        
    const requiredwithdrawals = await Withdrawal.findAll({where:{WalletId:walletId}});

    
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

    const wallet = await Wallet.findAll({where:
                                            {UserId: await getUserId(),
                                                id: walletId
                                            }})

    if (wallet.length === 0) return res.json({'message':'you dont have a wallet, create one, deposit the you can withdraw' })


    const requiredwithdrawal = await Withdrawal.findOne({where:{id: withdrawalId}})

    if(!requiredwithdrawal){
        return res.status(404).json({"message": "No withdrawal with specified id "});     
    }

    return res.json({
        code: HttpStatusCodes.OK,
        data: requiredwithdrawal

    })

}
