import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { SIGN_IN } from '../utils/mutations';
import AuthService from '../utils/auth';
import {Button, Grid, Typography, TextField, ButtonGroup} from '@mui/material'

export default function SignIn(props) {

    const [formState, setFormState] = useState({ email: '', password: '' });
    const [login, { data }] = useMutation(SIGN_IN);

    const [errors, setErrors] = useState([]);

    // update state based on form input changes
    const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
        ...formState,
        [name]: value,
    });
    };

    // check the form fields are valid, use error buffer
    const validateForm = () => {
        let valid = true;
        let errorBuffer = [];

        //check email presence
        if(!formState.email){
            errorBuffer.push('You need an email address to login');
        }

        //check email looks good
        if(!formState.email.includes('@') || !formState.email.includes('.')){
            errorBuffer.push('Your email looks wrong');
        }

        //check password
        if(!formState.password){
            errorBuffer.push('You need a password to login');
        }

        //check password is at least 8 characters
        if(formState.password.length < 8){
            errorBuffer.push('Your password must be 8 characters long');
        }

        setErrors(errorBuffer)

        if(errorBuffer.length > 0){
            valid = false
        }

        return valid
    }

    // submit form
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        validateForm();
        try { 
            const {data} = await login({
                variables: { ...formState },
            });

            console.log(`response token from server was`, data.signIn.token);
            AuthService.login(data.signIn.token);
        } catch (e) {
          console.error(e);
        }

        // clear form values
        setFormState({
            email: '',
            password: '',
        });
    };


    return (
        <div>
            {data ? (
              <p>
                Success! You may now head inside
                <Link to="/">back to the homepage.</Link>
              </p>
            ) : (
                <Grid container spacing={2} direction="column" alignItems="center" justifyContent="center" style={{minHeight: '10vh', paddingTop: '20px'}}>
                  <Grid item xs>
                    <Typography color="primary">
                      <h1>Login</h1>
                    </Typography>
                </Grid>
                  <Grid item xs>
                    <TextField
                      className="form-input"
                      placeholder="Your email"
                      name="email"
                      type="email"
                      label="Email"
                      value={formState.email}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs>
                      <TextField
                        className="form-input"
                        placeholder="******"
                        name="password"
                        type="password"
                        label="Password"
                        value={formState.password}
                        onChange={handleChange}
                      />
                  </Grid>
                  <Grid item xs>
                    <ButtonGroup variant='outlined' aria-label="outlined primary button group">
                      <Button
                        style={{ cursor: 'pointer' }}
                        type="submit"
                        onClick={handleFormSubmit}
                      >
                        Submit
                      </Button>
                      <Button href="/"
                        style={{ cursor: 'pointer' }}
                        type="cancel"
                      >
                        Back
                      </Button>
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
            )} 
        </div>
    )
}