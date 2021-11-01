import React from 'react';
// import {Autocomplete, TextField} from '@mui/material';
import {FormControl, InputLabel, Select, MenuItem} from '@mui/material';

export default function AccountTypeAutoComplete() {

    // const accountTypes = [
    //     'money',
    //     'crypto',
    //     'stock',
    // ]

    function handleChange () {
        console.log('Change handler not implemented yet')
    }

    return ( 
        // <Autocomplete
        //     disablePortal
        //     id="Type"
        //     options={accountTypes}
        //     sx={{ width: 300 }}
        //     renderInput={
        //         (params) => <TextField {...params} label="Type" />
        //     }
        // />
        <FormControl sx={{width: '25ch'}}>
            <InputLabel id="demo-simple-select-label">Type</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value="bank"
                label="Type"
                onChange={handleChange}
            >
                <MenuItem value={"money"}>money</MenuItem>
                <MenuItem value={"crypto"}>crypto</MenuItem>
                <MenuItem value={"stock"}>stock</MenuItem>
            </Select>
        </FormControl>
    )
}