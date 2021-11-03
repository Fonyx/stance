import React from 'react';
import {AppBar, Box, Toolbar, Typography, Button, IconButton} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import AuthService from '../utils/auth';


export default function Navbar() {

  const logout = (event) => {
    event.preventDefault();
    AuthService.logout();
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="primary"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            STANCE
          </Typography>
          {AuthService.loggedIn() ? (
            <React.Fragment>
              <Button color="secondary" variant="contained" href="/home">Home</Button>
              <Button color="secondary" variant="contained" onClick={logout}>Logout</Button>
              <Button color="secondary" variant="contained" href="/createTransaction">Create Transaction</Button>
              <Button color="secondary" variant="contained" href="/createAccount">Create Account</Button>
            </React.Fragment>
          ):(
            <React.Fragment></React.Fragment>
          )}
        </Toolbar>
      </AppBar>
    </Box>
    )
}
