import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function Compound() {

    function handleChange(){
        console.log('handle change not implemented yet')
    }

    return ( 
        <FormControl sx={{width: '25ch'}}>
            <InputLabel id="demo-simple-select-label">Compounds</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value="monthly"
                label="Type"
                onChange={handleChange}
            >
                <MenuItem value={10}>monthly</MenuItem>
                <MenuItem value={20}>quarterly</MenuItem>
                <MenuItem value={30}>yearly</MenuItem>
            </Select>
        </FormControl>
    )
}