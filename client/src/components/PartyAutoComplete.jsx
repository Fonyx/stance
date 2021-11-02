import React from 'react';
import {Autocomplete, TextField} from '@mui/material';

export default function PartyAutoComplete({parties, values, handleSelectChange}) {

    return ( 
        <div>
            <Autocomplete
                disablePortal
                clearOnBlur
                selectOnFocus
                handleHomeEndKeys
                id="3partyAffiliate"
                name='3partyAffiliate'
                options={parties}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                sx={{ width: 300 }}
                value={values.party}
                onChange={handleSelectChange('party')}
                renderInput={(params) => <TextField {...params} label="3rd Party" />}
            />
        </div>
    )
}