import * as React from 'react';
import Link from 'next/link';

import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CallIcon from '@mui/icons-material/Call';


export default function SimpleBottomNavigation() {
  const [value, setValue] = React.useState(0);

  return (
    <Paper elevation={3} sx={{width: '100%'}}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        sx={{width: '100%'}}
      >
        <Link href="/">
          <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        </Link>
        <Link href="/chat">
          <BottomNavigationAction label="Call" icon={<CallIcon />} />
        </Link>
        <Link href="#">
          <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
        </Link>
      </BottomNavigation>
    </Paper>
  );
}