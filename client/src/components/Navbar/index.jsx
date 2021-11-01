import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AuthService from '../../utils/auth';


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
            Stance
          </Typography>
          {AuthService.loggedIn() ? (
            <React.Fragment>
              <Button color="secondary" variant="contained" onClick={logout}>Logout</Button>
              <Button color="secondary" variant="contained" href="/createTransaction">Create Transaction</Button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Button color="secondary" variant="contained" href="/signin">Sign In</Button>
              <Button color="secondary" variant="contained" href="/signup">Sign Up</Button>
            </React.Fragment>
          )}
        </Toolbar>
      </AppBar>
    </Box>
    )
}
