import { Autocomplete, TextField, Button, InputAdornment } from '@mui/material'
import React, {useState} from 'react'

export default function SpecificMoneyDetails({currencies, handleSelectCurrency, handleChange, values, nextStep, prevStep}) {


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
        console.log('Form Valid');
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
        prevStep();
    }


    return (
        <div>
            <h1>Specific Money Details</h1>
            <Autocomplete
                disablePortal
                clearOnBlur
                selectOnFocus
                handleHomeEndKeys
                id="currency"
                name='currency'
                options={currencies}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                sx={{ width: 300 }}
                onChange={handleSelectCurrency()}
                renderInput={(props) => <TextField {...props} label="Currency" />}
            />
            <TextField
                label="Interest Rate"
                id="interestRate"
                onChange={handleChange('interestRate')}
                InputProps={{
                    endAdornment: <InputAdornment position="start">%</InputAdornment>,
            }} 
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