import React from 'react'
import {ButtonGroup, Typography, Button, Container, Grid} from '@mui/material'


export default function Landing() {
    return (
        <Container>
            <Grid container spacing={2} direction="column" alignItems="center" justifyContent="center" style={{marginTop: '25px'}}>
                <Grid item xs textAlign="center">
                    <Typography variant="h2" color="primary">WELCOME TO STANCE</Typography>
                    <Typography variant="h2" color="primary">Your Complete Financial Asset Tracker</Typography>
                </Grid>
                <Grid item xs={12} style={{paddingTop: '80px'}}>
                    <ButtonGroup variant="text" aria-label="outlined primary button group">
                        <Button href='/signup' color="primary">Sign Up</Button>
                        <Button href="/signin" color="primary">Sign In</Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        </Container>
    )
}
