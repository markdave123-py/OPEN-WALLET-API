import fetch, { RequestRedirect, Response } from  'node-fetch'
import { config } from '../config/env'
import { error } from 'console';

export const converter = {

    requestOptions: {
        method: 'GET',
        redirect: 'follow' as RequestRedirect,
        headers: {
            apikey: config.ApiKey,
        }

    },

    getConversion: async (from: any, to: any, amount: any) =>{

        const url = `https://api.apilayer.com/exchangerates_data/convert?to=${to}&from=${from}&amount=${amount}`;
        const response = await fetch(url, converter.requestOptions)
        .then(result => {return  result})
        .catch( err => { console.log(err)});
        
    },
}
