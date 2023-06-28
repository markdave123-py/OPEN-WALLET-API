import { Wallet } from '../models/wallet';
import { Transfer } from '../models/transfer';
import { dollarRate } from '../utils/utils';
import { NOT_FOUND, ForbiddenError } from '../commonErrors/Errors/Errors';
import { HttpStatusCodes } from '../commonErrors/httpCode';
import { NextFunction, Request, Response } from 'express';

Wallet.hasMany(Transfer);

export const makeTransfer = async(req: Request, res:Response, next: NextFunction) =>{

    const source_id = req.params.id;
    const destinationId = req.body.destinationId;
    const transferAmount = req.body.transferAmount;

    if (!transferAmount ||  !destinationId) {
        res.status(404).json({"message": "pls provide the necessary informations to perform ur transfer"});
        
    }

    if (transferAmount < 0){
            res.status(403).json("you can't deposit an amount less than zero");
            
        }

    const sourceWallet = await Wallet.findOne({where:{id: source_id}});

    // let  sourceWallet = wallets.find((wallet) => {
    //     return wallet.id === source_id
    // })

    let destinationWallet = await Wallet.findOne({where:{id: destinationId}})

    let updatedWallet : any

    if(!sourceWallet || !destinationWallet){
        res.status(HttpStatusCodes.NOT_FOUND).json({"message": "Source or destination wallets not found"});
        
    }
    let sourceCurrency = sourceWallet?.currency.toLowerCase()
    let sourceAmount: any =sourceWallet?.amount

    let destinationCurrency = destinationWallet?.currency.toLowerCase()
    // let destinationAmount: any = destinationWallet?.amount

    if ( sourceCurrency === destinationCurrency){
        if ( sourceAmount < transferAmount){
            return res.json({"message": "INSUFFICIENT FUNDS"})
        }else{
            updatedWallet = await sourceWallet?.update(
                { amount: sourceWallet?.amount - transferAmount },
                { where: { id: source_id}})

            await destinationWallet?.update(
                {amount: destinationWallet?.amount + transferAmount},
                { where: {id: destinationId}}
            )
        }
    }

    if (sourceCurrency === "naira" && destinationCurrency === "dollar"){
        if( transferAmount > sourceAmount ){
            return res.json(
                {"message": "INSUFFICIENT FUNDS make sure ur transer amount in dollors and is less then or equal to ur acc balance"})
        }else{
            updatedWallet = await sourceWallet?.update(
                { amount: sourceWallet?.amount - transferAmount },
                { where: { id: source_id}}
            )
            await destinationWallet?.update(
                {amount: destinationWallet?.amount + (transferAmount / dollarRate)},
                {where: { id: destinationId }}
            )
        }
    }

    if (sourceCurrency === "dollar" && destinationCurrency === "naira"){
        if( transferAmount > sourceAmount ){
            return res.json(
                {"message": "INSUFFICIENT FUNDS make sure ur transer amount  in naira and is less then or equal to ur acc balance"
            })
        }else{
            updatedWallet = await sourceWallet?.update(
                { amount: sourceWallet?.amount - transferAmount },
                { where: { id: source_id}}
            )
            await destinationWallet?.update(
                {amount: destinationWallet?.amount + (transferAmount * dollarRate)},
                {where: { id: destinationId }}
            )
        }
    }

    let transfer = await Transfer.create({
       amount: transferAmount,
       currency: destinationCurrency,
       WalletId: source_id,
       destinationId: destinationId
    })

    await transfer.save()

    return res.json({
        code: HttpStatusCodes.OK,
        sourceWallet: updatedWallet
    })
}

export const getAllTransfers = async(req: Request, res: Response, next: NextFunction) => {
    const walletId = req.params.id;

    if(!walletId){
        return res.status(404).json({"message": "pls specify the id of the wallet"})
        
    }
    // const wallets = await Wallet.findAll();

    // let wallet = wallets.find((wallet: any)=> {
    //     return wallet.id === walletId });

    // if(!wallet){
    //         res.status(404).json({"message": "NO wallet with the specified id"});
    //         throw new NOT_FOUND("NO wallet with the specified id");
    //     }
        
    const requiredTransfers = await Transfer.findAll({where:{WalletId:walletId}});

    // const requiredTransfers = transfers.filter((Transfer: any)=> {
    //     return Transfer.WalletId === walletId })
    
    if(!requiredTransfers){
        return res.status(404).json({"message": "No Transfers was made in this wallet"})     
        }

    return res.json({
        code: HttpStatusCodes.OK,
        data: requiredTransfers
    })

}

export const getOneTransfer = async(req: Request, res: Response, next: NextFunction) => {
    const transferId = req.params.id
    const walletId = req.params.wallet_id

    if (!transferId || !walletId) return res.status(404).json({"message": "pls specify the id of the wallet and Transfer"})
    
    const requiredTransfer = await Transfer.findOne({where:{id:transferId}});

    // const requiredTransfers = Transfers.filter((deposit: any)=> {
    //     return deposit.WalletId === walletId })

    // const requiredTransfer = requiredTransfers.filter((deposit: any ) => {
    //     return deposit.id === transferId 
    // })

    if(!requiredTransfer){
        return res.status(404).json({"message": "No Transfer with specified id "})     
    }

    return res.json({
        code: HttpStatusCodes.OK,
        data: requiredTransfer

    })

}