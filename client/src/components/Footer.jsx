import React from 'react';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import RestoreIcon from '@mui/icons-material/Restore';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Container, Box, Grid} from '@mui/material';

// export default function Footer() {

//     return (
//         <footer>
//             <Box textAlign="center" >
//                 <Container maxWidth="lg" textAlign="center">
//                     <Grid container spacing={5} textAlign="center">
//                         <Grid item textAlign="center">
//                             <h3></h3>
//                         </Grid>
//                     </Grid>
//                 </Container>
//             </Box>
//         </footer>
//     )
// }

import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function Footer() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <CssBaseline />
      <Container component="main" sx={{ mt: 8, mb: 2 }} maxWidth="sm">
        <Typography variant="h2" component="h1" gutterBottom>
          Sticky footer
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          {'Pin a footer to the bottom of the viewport.'}
          {'The footer will move as the main element of the page grows.'}
        </Typography>
        <Typography variant="body1">STANCE is a financial asset tracker: Made By FONYX</Typography>
      </Container>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body1">
            My sticky footer can be found here.
          </Typography>
          <Copyright />
        </Container>
      </Box>
    </Box>
  );
}
