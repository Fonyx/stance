import { Autocomplete, TextField, Button, Grid, ButtonGroup, Typography } from '@mui/material'
import React, {useState} from 'react'
export default function SpecificCryptoDetails({cryptos, handleSelectCrypto, values, nextStep, prevStep}) {


    const [errors, setErrors] = useState([]);

    // checks that the form is submittable, if it fails, sets error state and returns false, else true
    const validateFormSubmit = () => {
        let valid = true;
        let errorBuffer = [];

        console.log('state is: ',values);

        //check there is an assetCode
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
        prevStep();
    }

    return (
        <Grid container spacing={2} direction="column" alignItems="center" justifyContent="center" style={{paddingTop: '40px'}}>
            <Typography variant="h3" color="primary">Specific Crypto Details</Typography>
            <Grid item xs>
                <Autocomplete
                    disablePortal
                    clearOnBlur
                    selectOnFocus
                    handleHomeEndKeys
                    id="crypto"
                    name='crypto'
                    options={cryptos}
                    getOptionLabel={(option) => option}
                    isOptionEqualToValue={(option, value) => option === value}
                    sx={{ width: 300 }}
                    onChange={handleSelectCrypto()}
                    renderInput={(params) => <TextField {...params} label="Crypto" />}
                />
            </Grid>
            <Grid item xs>
                <div id="error">
                    {errors.map((error) => {
                        return <div>{error}</div>
                    })}
                </div>
            </Grid>
            <Grid item xs>
                <ButtonGroup>
                    <Button onClick={backup} variant="outlined">Back Up</Button>
                    <Button onClick={progress} variant="contained">Continue</Button>
                </ButtonGroup>
            </Grid>
        </Grid>
    )
}
