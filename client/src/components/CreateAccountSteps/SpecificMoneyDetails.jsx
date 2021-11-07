import { Autocomplete, TextField, Button, ButtonGroup, InputAdornment, Grid, Typography, } from '@mui/material'
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
        <Grid container spacing={2} direction="column" alignItems="center" justifyContent="center" style={{paddingTop: '40px'}}>
            <Typography variant="h3" color="primary">Specific Money Details</Typography>
            <Grid item xs>
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
            </Grid>
            
            <Grid item xs>
                <TextField
                    label="Interest Rate"
                    id="interestRate"
                    onChange={handleChange('interestRate')}
                    InputProps={{
                        endAdornment: <InputAdornment position="start">%</InputAdornment>,
                    }} 
                />
            </Grid>

            <Grid item xs>
                <ButtonGroup>
                    <Button onClick={backup} variant="outlined">Back Up</Button>
                    <Button onClick={progress} variant="contained">Next</Button>
                </ButtonGroup>
            </Grid>

            <Grid item xs>
                <div id="error">
                    {errors.map((error) => {
                        return <div>{error}</div>
                    })}
                </div>
            </Grid>
        </Grid>
    )
}