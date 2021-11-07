import { Autocomplete, TextField, Button, ButtonGroup, Typography, Grid } from '@mui/material'
import React, {useState} from 'react'
import {QUERY_STOCK_CHECK} from '../../utils/queries';
import { useLazyQuery } from '@apollo/client';

export default function SpecificStockDetails({exchanges, handleSelectExchange, handleSelectStock, values, nextStep, prevStep}) {


    const [errors, setErrors] = useState([]);
    var valid = false;

    const [stockCheck, { loading, data }] = useLazyQuery(QUERY_STOCK_CHECK);

    if(data){
        console.log(data);
    }

    const searchCode = (e) => {
        stockCheck({
            variables: {
                "assetCode": values.assetCode,
                "exchangeCode": values.exchangeCode
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
        prevStep();

    }

    // if the user query is valid
    if(data){
        if(data.checkStockCode.exists){
            valid = true
        }
    };

    return (
        <Grid container spacing={2} direction="column" alignItems="center" justifyContent="center" style={{paddingTop: '40px'}}>
            <Typography variant="h3" color="primary">Specific Asset Details</Typography>
            <Grid item xs>
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
            </Grid>
            <Grid item xs>
                <TextField
                    label="Ticker Code"
                    id="assetCode"
                    onChange={handleSelectStock()}
                />
            </Grid>
            <Grid item xs>
                <Button onClick={backup} variant="outlined">Back Up</Button>
                <Button onClick={searchCode} variant="contained">Search Code</Button>
            </Grid>
            
            
            <Grid item xs>
                <div id="error">
                    {errors.map((error) => {
                        return <div>{error}</div>
                    })}
                </div>
            </Grid>
            
            {
                loading
                ? <Grid item xs>Checking your ticker</Grid>
                : <div></div>
            }
            {valid
                ?<React.Fragment>
                    <Grid item xs textAlign="center">
                        <Typography variant="h5" color="secondary">Valid Ticker Code</Typography>
                    </Grid>
                    <Grid item xs>
                        <Button onClick={progress} variant="contained">Continue</Button>
                    </Grid>
                </React.Fragment>
                :<Grid item xs>
                    Not Valid Ticker Code
                </Grid>
            }
        </Grid>
    )
}