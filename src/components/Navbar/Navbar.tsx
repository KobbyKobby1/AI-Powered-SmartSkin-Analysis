'use client';

import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Menu as MenuIcon } from '@mui/icons-material';
import Link from 'next/link';
import { logo } from '../../assets';
import { usePathname } from 'next/navigation';
import { Container } from '@mui/material';
// import Signdialog from './Signdialog';
// import Registerdialog from './Registerdialog';

interface NavigationItem {
  name: string;
  href: string;
}

const navigation: NavigationItem[] = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about-us' },
  { name: 'Features', href: '/features' },
  { name: 'Contact', href: '/contact-us' },
];

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };
  const pathname = usePathname();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ padding: '10px 0', backgroundColor: 'white', boxShadow: 'none' }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
              <img src={logo.src} alt="smarkskin-logo" style={{ height: '48px' }} />
            </Box>

            {/* Navigation Links for Desktop */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1, justifyContent: 'center' }}>
              {navigation.map((item) => (
                <Link href={item.href} key={item.name} passHref>
                  <Button
                    sx={{
                      fontSize: '1rem',
                      textTransform: 'none',
                      color: pathname === item.href ? 'white' : 'black',
                      opacity: 0.75,
                      '&:hover': { opacity: 1 },
                      backgroundColor: pathname === item.href ? '#E5BC76' : 'transparent',
                    }}
                  >
                    {item.name}
                  </Button>
                </Link>
              ))}
            </Box>

            {/* Sign In and Register Dialogs */}
            {/* <Signdialog /> */}
            {/* <Registerdialog /> */}

            {/* Drawer for Mobile View */}
            <IconButton
              edge="end"
              color="default"
              aria-label="menu"
              sx={{ display: { xs: 'block', md: 'none' } }}
              onClick={() => toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer anchor="right" open={drawerOpen} onClose={() => toggleDrawer(false)}>
              <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={() => toggleDrawer(false)}
                onKeyDown={() => toggleDrawer(false)}
              >
                <List>
                  {navigation.map((item) => (
                    <ListItem component="a" key={item.name} href={item.href}>
                      <ListItemText primary={item.name} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Drawer>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
};

export default Navbar;
