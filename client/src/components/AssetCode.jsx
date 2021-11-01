import React from 'react';
import {QUERY_GET_ALL_CURRENCIES} from '../utils/queries';
import { useQuery } from '@apollo/client';
import {FormControl, TextField} from '@mui/material';

export default function AssetCode() {

    const {loading, data} = useQuery(QUERY_GET_ALL_CURRENCIES, {});

    const currencies = data?.allCurrencies.map((currencyObj) => currencyObj.name) || [];

    if(loading){
        return ( 
            <div>Loading</div>
        )
    }else{
        console.log(currencies);
    }

    return ( 
        <FormControl
            id="stock ticker"
            sx={{ width: 300 }}
            >
            <TextField label="Stock Ticker" />
        </FormControl>
    )
}