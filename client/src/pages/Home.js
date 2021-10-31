import React from 'react'
import {Grid} from '@mui/material'
import {ButtonGroup, Button} from '@mui/material'

export default function Home() {
    return (
        <Grid container spacing={2} direction="column" alignItems="center" justifyContent="center" style={{minHeight: '60vh'}}>
            <Grid item xs={12}>
                <ButtonGroup variant="text" aria-label="outlined primary button group">
                    <Button href='/signup'>Sign Up</Button>
                    <Button href="/signin">Sign In</Button>
                </ButtonGroup>
            </Grid>
        </Grid>
    )
}
