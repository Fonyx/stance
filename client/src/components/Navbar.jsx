import React from 'react';
import {AppBar, Box, Toolbar, Grid, Typography, Button, IconButton} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import AuthService from '../utils/auth';


export default function Navbar() {

  const logout = (event) => {
    event.preventDefault();
    AuthService.logout();
  }

  return (

    // <Box sx={{ flexGrow: 1 }}>
    //   <AppBar position="static">
    //     <Toolbar>
    //       <IconButton
    //         size="large"
    //         edge="start"
    //         color="inherit"
    //         aria-label="menu"
    //         sx={{ mr: 2 }}
    //       >
    //         <MenuIcon />
    //       </IconButton>
    //       <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
    //         News
    //       </Typography>
    //       <Button color="inherit">Login</Button>
    //     </Toolbar>
    //   </AppBar>
    // </Box>

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
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" href="/home" color="secondary" sx={{ flexGrow: 1 }}>
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
