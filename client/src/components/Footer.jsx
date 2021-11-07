import React from 'react';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import RestoreIcon from '@mui/icons-material/Restore';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Container, Box, Grid} from '@mui/material';

export default function Footer() {

    return (
        <footer>
            <Box textAlign="center" >
                <Container maxWidth="lg" textAlign="center">
                    <Grid container spacing={5} textAlign="center">
                        <Grid item textAlign="center">
                            <h3>STANCE is a financial asset tracker: Made By FONYX</h3>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </footer>
    )
}
