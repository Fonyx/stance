import React from 'react';
import {QUERY_GET_ALL_EXCHANGES} from '../utils/queries';
import { useQuery } from '@apollo/client';
import {Autocomplete, TextField} from '@mui/material';

export default function ExchangeAutoComplete() {

    const {loading, data} = useQuery(QUERY_GET_ALL_EXCHANGES, {});

    const exchanges = data?.allExchanges.map((exchangeObj) => exchangeObj.name) || [];

    if(loading){
        return ( 
            <div>Loading</div>
        )
    }else{
        console.log(exchanges);
    }

    return ( 
        <Autocomplete
            disablePortal
            id="exchange"
            options={exchanges}
            sx={{ width: 300 }}
            renderInput={
                (params) => <TextField {...params} label="Exchange" />
            }
        />
    )
}