import { Autocomplete, TextField, Button, InputAdornment } from '@mui/material'
import React, {useState} from 'react'

export default function SpecificMoneyDetails({exchanges, handleSelectExchange, handleChange, values, nextStep, prevStep}) {


    const [errors, setErrors] = useState([]);

    // checks that the form is submittable, if it fails, sets error state and returns false, else true
    const validateFormSubmit = () => {
        let valid = true;
        let errorBuffer = [];

        console.log('state is: ',values);

        //check currency
        if(!values.currency){
            errorBuffer.push('You need to choose a currency');
        }
        //check optional interest rate is a float
        if(values.interestRate){
            if (isNaN(values.interestRate) && !values.interestRate.toString().indexOf('.') !== -1){
                errorBuffer.push('That interest rate looks wrong');
            }
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
