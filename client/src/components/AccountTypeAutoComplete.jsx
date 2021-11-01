import React from 'react';
import {Autocomplete, TextField} from '@mui/material';

export default function AccountTypeAutoComplete() {

    const accountTypes = [
        'money',
        'crypto',
        'stock',
    ]

    return ( 
        <Autocomplete
            disablePortal
            id="Type"
            options={accountTypes}
            sx={{ width: 300 }}
            renderInput={
                (params) => <TextField {...params} label="Type" />
            }
        />
    )
}