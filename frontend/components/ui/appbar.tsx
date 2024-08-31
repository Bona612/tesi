'use client';


// import AppBar from '@mui/material/AppBar';
// import Box from '@mui/material/Box';
// import Toolbar from '@mui/material/Toolbar';
// import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import Menu from '@mui/material/Menu';
// import MenuIcon from '@mui/icons-material/Menu';
// import Container from '@mui/material/Container';
// import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
// import Tooltip from '@mui/material/Tooltip';
// import MenuItem from '@mui/material/MenuItem';
// import AdbIcon from '@mui/icons-material/Adb';
// import CssBaseline from '@mui/material/CssBaseline';
// import useScrollTrigger from '@mui/material/useScrollTrigger';
// import Fab from '@mui/material/Fab';
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// import Fade from '@mui/material/Fade';
// import Slide from '@mui/material/Slide';


import React from 'react';
import ConnectButton from '@/components/ConnectButton';
import Link from 'next/link';


const pages = ['Marketplace', 'My NFT', 'NFT creation'];


export default function AppBar() {
  return (
    <nav className="w-full border-0 py-4 lg:px-24 px-10 bg-gray-950">
        <h1 className={`text-3xl text-white`}>
            {pages.map((page) => (
                <Link href={`/${page.toLowerCase().replace(/\s+/g, '-')}`} key={page}>{page}</Link>
            ))}
        </h1>
    </nav>
  );
}