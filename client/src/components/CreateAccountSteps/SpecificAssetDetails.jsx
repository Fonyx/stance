import { Autocomplete, TextField, Button, InputAdornment, FormControl, FormControlLabel, Select } from '@mui/material'
import React, {useState} from 'react'
import {QUERY_STOCK_CHECK} from '../../utils/queries';
import { useLazyQuery } from '@apollo/client';

export default function SpecificMoneyDetails({exchanges, handleSelectExchange, handleChange, values, nextStep, prevStep}) {


    const [errors, setErrors] = useState([]);

    const [stockCheck, { loading, error, data }] = useLazyQuery(QUERY_STOCK_CHECK);



    const searchCode = (e) => {
        console.log(`Checking stock: ${values.assetCode} @ ${values.exchangeCode}`);
        stockCheck({
            variables: {
                "assetCode": values.assetCode,
                "exchangeCode": values.exchange
            }
        })
    }

    // checks that the form is submittable, if it fails, sets error state and returns false, else true
    const validateFormSubmit = () => {
        let valid = true;
        let errorBuffer = [];

        console.log('state is: ',values);

        //check currency
        if(!values.assetCode){
            errorBuffer.push('You need to specify a ticker code');
        }

        setErrors(errorBuffer)

        if(errorBuffer.length > 0){
            valid = false
        }

        return valid
    }

    const progress = (e) => {
        e.preventDefault();

        // check the state is correct before progressing
        if(validateFormSubmit()){
            console.log('Progressing form');
            nextStep();
        }
    }

    const backup = (e) => {
        e.preventDefault();

        // check the state is correct before progressing
        if(validateFormSubmit()){
            console.log('Regressing form');
            prevStep();
        }
    }

    console.log(data);

    if(values.type === 'stock'){
        return (
            <div>
                <h1>Specific Asset Details</h1>
                <Autocomplete
                    disablePortal
                    clearOnBlur
                    selectOnFocus
                    handleHomeEndKeys
                    id="exchange"
                    name='exchange'
                    options={exchanges}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    sx={{ width: 300 }}
                    onChange={handleSelectExchange()}
                    renderInput={(props) => <TextField {...props} label="Exchange" />}
                />
                <TextField
                    label="Ticker Code"
                    id="assetCode"
                    onChange={handleChange('assetCode')}
                />
                <Button onClick={searchCode} variant="outlined">Search Code</Button>
                <Button onClick={progress} variant="outlined">Continue</Button>
                <Button onClick={backup} variant="outlined">Back Up</Button>
                <div id="error">
                    {errors.map((error) => {
                        return <div>{error}</div>
                    })}
                </div>
            </div>
        )
    } else {

        return (
            <div>
                <h1>Specific Asset Details</h1>
                <TextField
                    label="Ticker Code"
                    id="assetCode"
                    onChange={handleChange('assetCode')}
                />
                <Button onClick={progress} variant="outlined">Continue</Button>
                <Button onClick={backup} variant="outlined">Back Up</Button>
                <div id="error">
                    {errors.map((error) => {
                        return <div>{error}</div>
                    })}
                </div>
            </div>
        )
    }

    
}
