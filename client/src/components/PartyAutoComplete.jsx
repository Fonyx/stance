import React from 'react';
import {QUERY_GET_ALL_PARTIES} from '../utils/queries';
import { useQuery } from '@apollo/client';
import {Autocomplete, TextField} from '@mui/material';

export default function PartyAutoComplete({type}) {

    const {loading, data} = useQuery(QUERY_GET_ALL_PARTIES, {});

    const parties = data?.allParties.map((partyObj) => partyObj.name) || [];

    if(loading){
        return ( 
            <div>Loading</div>
        )
    }else{
        console.log(parties);
    }

    return ( 
        <Autocomplete
            disablePortal
            clearOnBlur
            selectOnFocus
            handleHomeEndKeys
            getOptionLabel={(option) => {
                // Value selected with enter, right from the input
                if (typeof option === 'string') {
                    return option;
                }
                // Add "xxx" option created dynamically
                if (option.inputValue) {
                    return option.inputValue;
                }
                // Regular option
                return option.title;
            }}
            id="3partyAffiliate"
            options={parties}
            sx={{ width: 300 }}
            renderInput={
                (params) => <TextField {...params} label="3rd Party Affiliate" />
            }
        />
    )
}