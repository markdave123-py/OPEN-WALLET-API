import request  from "supertest";
import { app } from "../index";
import { genToken } from "../utils/genToken";



describe('Deposit Tests', () =>{
    let token;
    let postUrl;
    let getUrl;
    let inputAmount;

    beforeEach(() =>{
        //id fetched from  the database
        token = genToken('5673gdu33hhs')  // dummy id used
        inputAmount = { amount: 67000};

    });

    
})
