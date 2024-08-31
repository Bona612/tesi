'use client';

import React, { useState, useEffect } from 'react';

import ConnectButton from '@/components/ConnectButton';
import Link from 'next/link';
import BackButton from '@/components/BackButton';


type TokenBarProps = {
  tokenId: string;
}


function TokenBar({tokenId}: TokenBarProps) {
  const [mainAppBarVisible, setMainAppBarVisible] = useState(true);
  const [mainAppBarHeight, setMainAppBarHeight] = useState(0);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const mainAppBar = document.getElementById('main-app-bar');
      if (mainAppBar) {
        setMainAppBarHeight(mainAppBar.clientHeight);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;

    if (prevScrollPos > currentScrollPos && !mainAppBarVisible) {
      setMainAppBarVisible(true);
    } else if (prevScrollPos < currentScrollPos && mainAppBarVisible) {
      setMainAppBarVisible(false);
    }

    setPrevScrollPos(currentScrollPos);
  };

  const subAppBarTop = mainAppBarVisible ? `${mainAppBarHeight}px` : '0';


  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
  //   setAnchorElUser(event.currentTarget);
  // };
  // const handleCloseUserMenu = () => {
  //   setAnchorElUser(null);
  // };


  return (
    <div className="sub-bar">
        <BackButton />
        <h2 className="sub-bar-title">{tokenId}</h2>
    </div>
  );
  // return (
  //   <React.Fragment>
  //     <CssBaseline />
  //   <AppBar sx={{ bgcolor: '#000' }} position="sticky" style={{ top: subAppBarTop, transition: 'linear'}}>
  //     <Container maxWidth="xl">
  //       <Toolbar disableGutters>
  //       {/* <ThemeProvider theme={theme}> */}
  //           <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'flex' } }}>
  //               <BackButton></BackButton>
  //         </Box>
  //         {/* </ThemeProvider> */}
  //         {/* <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' }, fontFamily: 'monospace', fontWeight: 700 }}></Box> */}
  //         <Typography
  //           variant="h5"  // h6
  //           noWrap
  //           // component="a"
  //           // href="/"
  //           sx={{
  //             ml: { xs: 1, sm: 2, md: 4 },
  //             display: { xs: 'flex', md: 'flex' },
  //             flexGrow: 1,
  //             fontFamily: 'monospace',
  //             fontWeight: 700,
  //             letterSpacing: '.3rem',
  //             color: 'inherit',
  //             textDecoration: 'none',
  //           }}
  //         >
  //           {tokenId}
  //         </Typography>
  //         {/* </Box> */}
  //       </Toolbar>
  //     </Container>
  //   </AppBar>
  //   </React.Fragment>
  // );
}
export default TokenBar;