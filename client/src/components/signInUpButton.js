import React from 'react'
import {ButtonGroup, Button} from '@mui/material'

function SignInUpButton() {
    return (
        <ButtonGroup variant="text" aria-label="outlined primary button group">
            <Button href='/signup'>Sign Up</Button>
            <Button href="/signin">Sign In</Button>
        </ButtonGroup>
    )
}

export default SignInUpButton
