import { User } from '../models/user';
import { Wallet } from '../models/wallet';
import { getUserId} from '../utils/utils';
import { HttpStatusCodes } from '../commonErrors/httpCode';
import { NextFunction, Request, Response } from 'express';
import { converter } from '../utils/exchangeRate';
import { object } from 'joi';

User.hasMany(Wallet);

export const createNewWallet = async (req:Request, res: Response, next: NextFunction) =>{
    let currency = req.body.currency

    if (!currency){
        res.status(403).json("To create a wallet you need to specify the currency")
       
    }

    currency = currency.toLowerCase();


    try {

        let response = await converter.getSymbols()
        
        let symbols = response.symbols

        const symbolsKeys = Object.keys(symbols);
        const keysAsString = symbolsKeys.map( keys => String(keys).toLowerCase())

        if (!keysAsString.includes(currency)){
            return res.status(403).json("The currency should be in the abbrevaited format eg usd, ngn etc..")
        }
        

    let wallet = await Wallet.create({
        currency,
        UserId: await getUserId()
    })

    await wallet.save();

    return  res.json({
        code: HttpStatusCodes.CREATED,
        message: "Wallet successfuly created",
        data: wallet
    })

        
    } catch (error) {
        console.log(error)
        return res.status(500).json('Internal server error!!')
    }

}

    

export const getWallets = async (req:Request, res: Response, next: NextFunction) => {
    
    const wallets = await Wallet.findAll({where: {UserId: await getUserId()}});

    if(wallets.length === 0){
        res.json({'message': "You dont have any wallet yet"})
    }
    
    return res.json({
        code: HttpStatusCodes.OK,
        data: wallets
    })
}


export const getWalletById = async (req:Request, res: Response, next: NextFunction) => {

    const id = req.params.id;

    const reqWallet = await Wallet.findAll({where: {UserId: await getUserId(),
                                                            id:id}});



    if(!reqWallet || reqWallet.length == 0){
        return res.status(404).json({"message": "NO wallet with the specified id "})
    }

    return res.json({
        code: HttpStatusCodes.OK,
        data: reqWallet
    })
}   


export const deleteWallet = async (req:Request, res: Response, next: NextFunction) => {

     const id = req.params.id;

    const reqWallet = await Wallet.findAll({where: {UserId: await getUserId(),
                                                            id:id}});

    // if(wallets.length === 0){
    //     res.json({'message': "You dont have any wallet yet"})
    // }
    
   

    // const reqWallet = wallets.find((wallet: any)=> {
    //     return wallet.id === id});

    if(!reqWallet){
        return res.status(404).json({"message": "NO wallet with the specified id or you are not the user that creted this wallet"})
    }
    else{
        await Wallet.destroy(
            { where: {id: id}}
        );
    
        return res.json({
            code: HttpStatusCodes.OK,
            "message": "This wallet has been deleted sucessfully"
        
        })
    }
    

}   



// export const depositIntoWallet = async(req: Request, res: Response, next: NextFunction) =>{
//     const depositAmount = req.body.amount;
//     const currency = req.body.currency;
//     const wallets = await Wallet.findAll();
    
//     const id = req.params.id;

//     const reqWallet = wallets.find((wallet: any)=> {
//         return wallet.id === id});

//     if(!reqWallet){
//         res.status(404).json({"message": "NO wallet with the specified id"})
//     }

//     if(!depositAmount){
//         res.status(404).json({ "message": "Kindly provide the amount you want to deposit"})
//     }
    
//     if(!currency){
//         res.status(404).json({"message": "pls specify the currency"})
//     }

//     let  updatedWallet

//     if ( currency === reqWallet?.currency){
//         updatedWallet = await reqWallet?.update(
//         { amount: reqWallet.amount + depositAmount },
//         { where: { id: id}}
//     )}

//     if (currency === "naira" && reqWallet?.currency === "dollar"){
//         updatedWallet = await reqWallet?.update(
//             { amount: reqWallet?.amount + (depositAmount / dollarRate) },
//             { where: { id: id}}
//     )}

//     if (currency === "dollar" && reqWallet?.currency === "naira"){
//         updatedWallet = await reqWallet?.update(
//             { amount: reqWallet?.amount + (depositAmount * dollarRate) },
//             { where: { id: id}}
//     )}

//     return res.json(
//         {
//             code: HttpStatusCodes.OK,
//             data: updatedWallet
//         })
    

    

