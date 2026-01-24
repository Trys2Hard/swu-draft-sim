import { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { FaDiscord } from 'react-icons/fa';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  //Styles
  const styles = {
    appBar: {
      position: 'relative',
      background:
        'linear-gradient(to right, rgb(12, 39, 48), rgb(27, 96, 117), rgb(12, 39, 48))',
      mb: '1rem',
    },
    toolbar: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    link: {
      textDecoration: 'none',
      color: 'inherit',
      p: '0 0.4rem 0 0.4rem',
      borderRadius: '15px',
      transition: 'background-color 0.3s ease-in-out',
      '&:hover': {
        backgroundColor: 'rgb(33, 76, 88)',
      },
      '&.active': {
        borderBottom: '1px solid var(--off-white)',
      },
    },
    discordIcon: {
      position: 'absolute',
      right: '5.5rem',
      color: 'white',
      transition: 'color 0.2s ease-in-out',
      '&:hover': { color: '#5865F2' },
    },
    gitHubIcon: {
      position: 'absolute',
      right: '3rem',
      color: 'white',
      transition: 'color 0.2s ease-in-out',
      '&:hover': { color: '#5865F2' },
    },
  };

  return (
    <Box>
      <AppBar position='static' sx={styles.appBar}>
        <Toolbar sx={styles.toolbar}>
          <Box
            component='img'
            src='swudraftsim-logo.png'
            sx={{ width: '3.5rem', mr: '0.2rem' }}
          />

          <Typography
            variant='h5'
            component='p'
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            SWUDraftSim
          </Typography>

          <Box sx={{ ml: '1.5rem', display: { xs: 'none', md: 'flex' } }}>
            <Typography
              component={NavLink}
              variant='h6'
              to='/'
              sx={styles.link}
            >
              Draft
            </Typography>
            <Typography
              component={NavLink}
              variant='h6'
              to='/sealed'
              sx={styles.link}
            >
              Sealed
            </Typography>
          </Box>

          <IconButton
            href='https://discord.gg/yERW2Z73wc'
            target='_blank'
            sx={styles.discordIcon}
          >
            <FaDiscord size={28} />
          </IconButton>

          <IconButton
            href='https://github.com/Trys2Hard/swu-draft-sim'
            target='_blank'
            sx={styles.gitHubIcon}
          >
            <GitHubIcon />
          </IconButton>

          <IconButton
            size='large'
            color='inherit'
            aria-label='menu'
            onClick={toggleDrawer(true)}
            sx={{
              position: 'absolute',
              right: 0,
              display: { xs: 'flex', md: 'none' },
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor='right' open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: '12rem',
            height: '100%',
            background:
              'linear-gradient(to bottom, rgb(12, 39, 48), rgb(27, 96, 117), rgb(12, 39, 48))',
          }}
          role='presentation'
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List sx={{ '& .MuiListItem-root': { color: 'white' } }}>
            <ListItem disablePadding>
              <ListItemButton component={NavLink} to='/'>
                <ListItemText primary='Draft' />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton component={NavLink} to='/sealed'>
                <ListItemText primary='Sealed' />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
