import request  from "supertest";
import { app } from "../index";
import { genToken } from "../utils/genToken";


interface IInputBody {
    currency:string | undefined
    amount:number | undefined
}


describe('Deposit Tests', () =>{
    let token:string = ''
    let postUrl;
    let getUrl;
    let inputBody:IInputBody;

    beforeEach(() =>{
        //id fetched from  the database
        token = genToken('5673gdu33hhs')  // dummy id used
        inputBody = { amount: 67000, currency: 'usd'};

    });

    const makePostRequest = async (wallet_id: String) => {
        postUrl = `/wallet/${wallet_id}/deposits`
        return await request(app)
        .post(postUrl)
        .set('authorization', `Bearer ${token!}`)
        .send(inputBody!);

    }


    const makeGetRequest = async (wallet_id: String) => {
        getUrl = `/wallet/${wallet_id}/deposits`

        return await request(app)
        .get(getUrl)
        .set('authorization', `Bearer ${token!}`);

    }

    it('should return 400 error if no deposit amount or currency is given', async () => {

        inputBody!.amount = undefined
        inputBody!.currency = undefined

        const response = await makePostRequest('mPo0qpV3sM82s56k')
        expect(response.status).toBe(400)
        expect(response.body.message).toBe("Provide the currency and amount to be deposited")

    })

    it('should return 403 if the deposit amount is less than zero', async () =>{
       
        inputBody!.amount = -100

        const response = await makePostRequest('bdjdfr3782sfvdds')
        expect(response.status).toBe(403)
        expect(response.body.message).toBe("you can't deposit an amount less than or equal to zero")
    })

    xit('should return 200 if deposit is made', async () => {
        inputBody!.amount = 29000
        inputBody!.currency = "usd"

        const response = await makePostRequest('ghjklib346dbbdjcde');
        expect(response.status).toBe(201);

    });


    xit('should return 404 if wallet has no deposit', async () =>{

        const response = await makeGetRequest('ndurbrj278e94nrcndd')
        expect(response.status).toBe(200);
        //expect(response.body.message).toBe('No deposit with specified id');
    });

    it('should return 200 if the wallet has deposits', async () =>{

        const response = await makeGetRequest('d8d3ef5e-b681-44a4-934e-f3ec7f6d31fd')
        expect(response.status).toBe(200)
    })
    
    xit('should return a particular deposit', async () =>{
        const wallet_id = 'tevhd267difbeid'
        const deposit_id = '36vdubdnk9uds2'

        getUrl = `/wallet/${wallet_id}/deposits/${deposit_id}`

        const response = await request(app)
                                        .get(getUrl)
                                        .set('x-auth-token', token!)

        expect(response.status).toBe(200)
    })

    xit('should return 404 error if a deposit does not exists', async () => {

        const wallet_id = 'tevhd267difbeid';
        const deposit_id = 'does not exist';

        getUrl = `/wallet/${wallet_id}/deposits/${deposit_id}`

        const response = await request(app)
        .get(getUrl)
        .set('x-auth-token', token!)
        expect(response.status).toBe(400)
        expect(response.body.message).toBe('No deposit with specified id')



    });
    
    
})




// describe('Deposit Tests', () =>{
//     let token:string  = '';
//     let postUrl :string = '';
//     let getUrl :string = '';
//     let inputBody:IInputBody= null;

//     beforeEach(() =>{
//         //id fetched from  the database
//         token = genToken('5673gdu33hhs') as string  // dummy id used
//         inputBody = { amount: 67000, currency: 'usd'};

//     });

//     const makePostRequest = (wallet_id: String) => {
//         postUrl = `/wallet/${wallet_id}/deposits` 
//         return request(app)
//         .post(postUrl)
//         .set('x-auth-token', token!)
//         .send(inputBody!);

//     }


//     const makeGetRequest = (wallet_id: any) => {
//         getUrl = `/wallet/${wallet_id}/deposits`

//         return request(app)
//         .get(getUrl)
//         .set('x-auth-token', token!);

//     }

//     it('should return 400 error if no deposit amount or currency is given', async () => {

//         inputBody!.amount = undefined
//         inputBody!.currency = undefined

//         const response = await makePostRequest('mPo0qpV3sM82s56k')
//         expect(response.status).toBe(400)
//         expect(response.body.message).toBe("Provide the currency and amount to be deposited")

//     })

//     it('should return 403 if the deposit amount is less than zero', async () =>{
       
//         inputBody!.amount = -100

//         const response = await makePostRequest('bdjdfr3782sfvdds')
//         expect(response.status).toBe(403)
//         expect(response.body.message).toBe("NO wallet with the specified id or You did not create the wallet with this id")
//     })

//     it('should return 200 if deposit is made', async () => {
//         inputBody!.amount = 290008
//         inputBody!.currency = 'usd'

//         const response = await makePostRequest('ghjklib346dbbdjcde');
//         expect(response.status).toBe(200);

//     });


//     it('should return 404 if wallet has no deposit', async () =>{

//         const response = await makeGetRequest('ndurbrj278--e94nrcndd')
//         expect(response.status).toBe(404);
//         expect(response.body.message).toBe('NO wallet with the specified id or you did not create this wallet');
//     });

//         it('should return 200 if the wallet has deposits', async () =>{

//             const response = await makeGetRequest('fghjkrurbfirdo3484dni9n')
//             expect(response.status).toBe(201)
//         })
    
//         it('should return a particular deposit', async () =>{
//             const wallet_id = 'tevhd267difbeid'
//             const deposit_id = '36vdubdnk9uds2'

//             getUrl = `/wallet/${wallet_id}/deposits/${deposit_id}`

//             const response = await request(app)
//                                             .get(getUrl)
//                                             .set('x-auth-token', token!)

//             expect(response.status).toBe(200)
//         })


//         it('should return 404 error if a deposit does not exists', async () => {

//             const wallet_id = 'tevhd267difbeid';
//             const deposit_id = 'does not exist';

//             getUrl = `/wallet/${wallet_id}/deposits/${deposit_id}`

//             const response = await request(app)
//             .get(getUrl)
//             .set('x-auth-token', token!)
//             expect(response.status).toBe(400)
//             expect(response.body.message).toBe('No deposit with specified id')



//         });
    
    
// })
