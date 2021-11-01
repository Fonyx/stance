import React from 'react';
import {QUERY_GET_ALL_CURRENCIES} from '../utils/queries';
import { useQuery } from '@apollo/client';
import {Autocomplete, TextField} from '@mui/material';

export default function CurrencyAutoComplete() {

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
        <Autocomplete
            disablePortal
            id="currency"
            options={currencies}
            sx={{ width: 300 }}
            renderInput={
                (params) => <TextField {...params} label="Currency"/>
            }
        />
    )
}