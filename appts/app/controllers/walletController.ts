import { User } from '../models/user';
import { Wallet } from '../models/wallet';
import { getUserId, dollarRate } from '../utils/utils';
import { ForbiddenError, SERVER_ERROR } from '../commonErrors/Errors/Errors';
import { HttpStatusCodes } from '../commonErrors/httpCode';
import { NextFunction, Request, Response } from 'express';

User.hasMany(Wallet);

export const createNewWallet = async (req:Request, res: Response, next: NextFunction) =>{
    let currency = req.body.currency

    if (!currency){
        res.status(403).json("To create a wallet you need to specify the currency")
        throw new ForbiddenError("To create a wallet you need to specify the currency");
    }

    currency = currency.toLowerCase()

    if (currency != "naira" || currency != "dollar"){
        res.status(403).json("You can only create a Naria and Dollar account with us thanks")
        throw new ForbiddenError("You can only create a Naria and Dollar account with us thanks");
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
}

export const getWallets = async (req:Request, res: Response, next: NextFunction) => {
    
    const wallets = await Wallet.findAll({where: {UserId: await getUserId()}});
    //console.log(await getUserId())

    // const requiredWallets = wallets.find(async (wallets1:any) => {
    //     console.log(wallets1.UserId, await getUserId())
    //     return wallets1.UserId === await getUserId()
        
    // })

    if(wallets.length === 0){
        res.json({'message': "You dont have any wallet yet"})
    }
    
    return res.json({
        code: HttpStatusCodes.OK,
        data: wallets
    })
}


export const getWalletById = async (req:Request, res: Response, next: NextFunction) => {

    const wallets = await Wallet.findAll({where: {UserId: await getUserId()}});

    if(wallets.length === 0){
        res.json({'message': "You dont have any wallet yet"})
    }
    
    const id = req.params.id;

    const reqWallet = wallets.find((wallet: any)=> {
        return wallet.id === id});

    if(!reqWallet){
        res.status(404).json({"message": "NO wallet with the specified id "})
    }

    return res.json({
        code: HttpStatusCodes.OK,
        data: reqWallet
    })
}   


export const deleteWallet = async (req:Request, res: Response, next: NextFunction) => {

    const wallets = await Wallet.findAll({where: {UserId: await getUserId()}});

    if(wallets.length === 0){
        res.json({'message': "You dont have any wallet yet"})
    }
    
    const id = req.params.id;

    const reqWallet = wallets.find((wallet: any)=> {
        return wallet.id === id});

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
    

    

