import React, {useState} from 'react'
import {Select, MenuItem, Button, Grid, ButtonGroup, Typography} from '@mui/material';
import {Autocomplete, TextField} from '@mui/material';

export default function CoreDetails({parties, values, handleChange, handleSelectChange, nextStep}) {

    const [errors, setErrors] = useState([]);

    // checks that the form is submittable, if it fails, sets error state and returns false, else true
    const validateFormSubmit = () => {
        let valid = true;
        let errorBuffer = [];

        //check name
        if(!values.name){
            errorBuffer.push('You need to name your account');
        }
        //check balance exists
        if(!values.openingBalance){
            // exclude if value is default 0
            if(values.openingBalance !== 0){
                errorBuffer.push('You need set a balance for your account');
            }
        }
        //check balance is a float
        if(values.openingBalance){
            if (isNaN(values.openingBalance) && !values.openingBalance.toString().indexOf('.') !== -1){
                errorBuffer.push('That balance isn\'t valid');
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

    return (
        <Grid container spacing={2} direction="column" alignItems="center" justifyContent="center" style={{paddingTop: '40px'}}>
            <Typography variant="h3" color="primary">Basic Account Details</Typography>
            <Grid item xs>
                <Select
                    labelId="type"
                    id="type"
                    value={values.type}
                    label="Type"
                    onChange={handleChange('type')}
                >
                    <MenuItem value={"money"}>money</MenuItem>
                    <MenuItem value={"crypto"}>crypto</MenuItem>
                    <MenuItem value={"stock"}>stock</MenuItem>
                </Select>
            </Grid>
            <Grid item xs>
                <TextField 
                    id="accountName" 
                    onChange={handleChange('name')} 
                    label="Account Name" 
                    value={values.name} 
                    placeholder="My new account"/>
            </Grid>

            <Grid item xs>
                <TextField 
                    id="openingBalance" 
                    onChange={handleChange('openingBalance')} 
                    label="Balance" 
                    value={values.openingBalance} 
                    placeholder="0.00"/>
            </Grid>

            <Grid item xs textAlign="center">
                <Typography variant="p" color="primary">Optional</Typography>
                <Autocomplete
                    disablePortal
                    clearOnBlur
                    selectOnFocus
                    handleHomeEndKeys
                    id="3partyAffiliate"
                    name='3partyAffiliate'
                    options={parties}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    sx={{ width: 300 }}
                    onChange={handleSelectChange()}
                    renderInput={(params) => <TextField {...params} label="3rd Party" />}
                />
            </Grid>

            <Grid item xs>
                <ButtonGroup>
                    <Button href="/home" variant="outlined">Cancel</Button>
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