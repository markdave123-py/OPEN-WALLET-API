import fetch from  'isomorphic-fetch'
import { config } from '../config/env'
import { error } from 'console';


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
        const response = await fetch(url, converter.requestOptions)
        return response.status === 200 ? response.json() : error
        
        
        
    },
    getSymbols:async () => {
        const url = "https://api.apilayer.com/exchangerates_data/symbols"
        const response = await fetch(url, converter.requestOptions)
        return  response.json()
        
    }
}
