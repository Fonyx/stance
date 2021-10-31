import React, { useState } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RestoreIcon from '@mui/icons-material/Restore';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {BottomNavigation, BottomNavigationAction} from '@mui/material';
// import { useLocation, useHistory } from 'react-router-dom';

export default function Footer() {
    // const location = useLocation();
    // const history = useHistory();

    const [value, setValue] = useState('home');

    return (
        <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        >
            <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
            <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
            <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
        </BottomNavigation>
    )
}
