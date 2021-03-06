import React from 'react';
import {AppBar, Box, Toolbar, Typography, Button, IconButton} from '@mui/material'
// import MenuIcon from '@mui/icons-material/Menu'
import AuthService from '../utils/auth';
import Icon from '@material-ui/core/Icon';


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
              color="secondary"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <IconButton href="/home">
                <Icon className="navbarSvgIcon">
                  <img className="navbarSvgImg" src="/min_fox_orange.svg" alt="fonyx purple min logo"/>
                </Icon>
              </IconButton>
            </IconButton>
            <Typography variant="h4" component="div" href="/home" color="secondary" sx={{ flexGrow: 1 }}>
              STANCE
            </Typography>
            {AuthService.loggedIn() ? (
            <Button edge="end" color="secondary" variant="contained" onClick={logout}>Logout</Button>
            ):(
               <React.Fragment></React.Fragment>
            )}
          </Toolbar>
      </AppBar>
    </Box>
  )
}
