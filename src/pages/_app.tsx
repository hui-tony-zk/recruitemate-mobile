import { AppProps } from 'next/app';
import SimpleBottomNavigation from '@/components/navigation/SimpleBottomNavigation';
import { Box } from '@mui/material';
import React from 'react'

// import MUI
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#678983'
    }
  },
});

// mobile only

import { styled } from '@mui/material/styles';
const Root = styled('div')(({ theme }) => ({
  width: 500,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));


export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Root>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            height: '100vh',
            maxHeight: 1000,
            maxWidth: 600,
            margin: '0 auto',
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Box flexGrow={1}>
            <Component {...pageProps} />
          </Box>
          <SimpleBottomNavigation />
        </Box>
      </ThemeProvider>
    </Root>
  );
}
