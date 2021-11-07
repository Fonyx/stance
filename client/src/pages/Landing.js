import React from 'react'
import {ButtonGroup, Typography, Button, Container, Grid} from '@mui/material'



export default function Landing() {
    return (
        <Container maxWidth="lg">
            <Grid container spacing={2} direction="column" alignItems="center" justifyContent="center" style={{marginTop: '25px'}}>
                <Grid item xs textAlign="center">
                    <Typography color="primary">
                        <h1>WELCOME TO STANCE</h1>
                        <h1>Your Complete Financial Asset Tracker</h1>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <ButtonGroup variant="text" aria-label="outlined primary button group">
                        <Button href='/signup'>Sign Up</Button>
                        <Button href="/signin">Sign In</Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        </Container>
    )
}
