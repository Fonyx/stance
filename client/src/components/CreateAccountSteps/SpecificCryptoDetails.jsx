import { Autocomplete, TextField, Button, InputAdornment, FormControl, FormControlLabel, Select } from '@mui/material'
import React, {useState} from 'react'
import {QUERY_STOCK_CHECK} from '../../utils/queries';
import { useLazyQuery } from '@apollo/client';

export default function SpecificCryptoDetails({cryptos, handleSelectExchange, handleChange, values, nextStep, prevStep}) {


    const [errors, setErrors] = useState([]);
    var valid = false;

    const [stockCheck, { loading, error, data }] = useLazyQuery(QUERY_STOCK_CHECK);


    // hardwire the exchange code to CC for crypto checks
    const searchCode = (e) => {
        console.log('Checking asset code: ', values.assetCode);        
        let cryptoAssetCode = values.assetCode.toUpperCase() + '-USD';
        console.log('modified asset code for crypto is: ',cryptoAssetCode);
        stockCheck({
            variables: {
                "assetCode": cryptoAssetCode,
                "exchangeCode": 'CC'
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

    console.log('data', data);
    // if the user query is valid
    if(data){
        if(data.checkStockCode.exists){
            valid = true
        }
    };

    return (
        <div>
            <h1>Specific Crypto Details</h1>
            <TextField
                label="Ticker Code"
                id="assetCode"
                onChange={handleChange('assetCode')}
            />
            <div id="error">
                {errors.map((error) => {
                    return <div>{error}</div>
                })}
            </div>
            <Button onClick={searchCode} variant="outlined">Search Code</Button>
            <Button onClick={backup} variant="outlined">Back Up</Button>
            {
                loading
                ? <div>Checking your ticker</div>
                : <div></div>
            }
            {valid
                ?<div>
                    Valid Ticker Code
                    <Button onClick={progress} variant="outlined">Continue</Button>
                </div>
                :<div>
                    Not Valid Ticker Code
                </div>
            }
        </div>
    )
}
