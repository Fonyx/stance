import React from 'react';
import {FormControl, InputLabel, Select, MenuItem} from '@mui/material';

export default function AccountTypeAutoComplete({values, handleChange}) {

    return ( 
        <FormControl sx={{width: '25ch'}}>
            <InputLabel id="demo-simple-select-label">Type</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={values.type}
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