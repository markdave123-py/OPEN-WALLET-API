import request  from "supertest";
import { app } from "../index";
import { genToken } from "../utils/genToken";



describe('Deposit Tests', () =>{
    let token;
    let postUrl;
    let getUrl;
    let inputBody;

    beforeEach(() =>{
        //id fetched from  the database
        token = genToken('5673gdu33hhs')  // dummy id used
        inputBody = { amount: 67000, currency: 'usd   '};

    });

    const makePostRequest = (wallet_id: any) => {
        postUrl = `/wallet/${wallet_id}/deposits`
        return request(app)
        .post(postUrl)
        .set('x-auth-token', token!)
        .send(inputBody!);

    }


    const makeGetRequest = (wallet_id: any) => {
        getUrl = `/wallet/${wallet_id}/deposits`

        return request(app)
        .get(getUrl)
        .set('x-auth-token', token!);

    }

    it('should return 400 error if no deposit amount or currency is given', async () => {

        inputBody!.amount = undefined
        inputBody!.currency = undefined

        const response = await makePostRequest('mPo0qpV3sM82s56k')
        expect(response.status).toBe(400)
        expect(response.body.message).toBe('{"message":"Provide the currency and amount to be deposited"}')

    })

    
})
