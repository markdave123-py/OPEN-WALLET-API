import fetch from  'isomorphic-fetch'
import { config } from '../config/env'


export const converter = {

    requestOptions: {
        method: 'GET',
        redirect: 'follow',
        headers: {
            apikey: config.ApiKey,
        }

    },

    getConversion: async (from: any, to: any, amount: any) =>{

        const url = `https://api.apilayer.com/exchangerates_data/convert?to=${to}&from=${from}&amount=${amount}`;
        await fetch(url, converter.requestOptions)
        .then((result:any)=> {return result})
        .catch((err:any) => console.log(err))

        
        
    },
}
