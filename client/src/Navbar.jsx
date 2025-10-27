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
    ListItemText
} from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

export default function Navbar() {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    //Styles
    const styles = {
        appBar: {
            position: 'relative',
            background:
                'linear-gradient(to right, rgba(31, 202, 255, 0.1), rgba(31, 202, 255, 0.4), rgba(31, 202, 255, 0.1))',
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
            padding: '0.3rem 0.5rem',
            borderRadius: '20px',
            transition: 'background-color 0.3s ease-in-out',
            '&:hover': {
                backgroundColor: 'rgba(31, 202, 255, 0.1)',
            },
        },
    };

    return (
        <Box>
            <AppBar position="static" sx={styles.appBar}>
                <Toolbar sx={styles.toolbar}>
                    <Box component="img" src="swudraftsim-logo.png" sx={{ width: '3.5rem', mr: '0.2rem' }} />

                    <Typography variant="h5" component="p">
                        SWUDraftSim
                    </Typography>

                    <Box sx={{ ml: '1.5rem', display: { xs: 'none', md: 'flex' } }}>
                        <Typography component={Link} variant="h6" to="/" sx={styles.link}>
                            Draft
                        </Typography>
                        <Typography component={Link} variant="h6" to="/sealed" sx={styles.link}>
                            Sealed
                        </Typography>
                    </Box>

                    <IconButton
                        size="large"
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleDrawer(true)}
                        sx={{ position: 'absolute', right: 0, display: { xs: 'flex', md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
            >
                <Box
                    sx={{ width: '12rem', height: '100%', backgroundColor: 'rgba(26, 26, 26, 1)' }}
                    role="presentation"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                >
                    <List sx={{ '& .MuiListItem-root': { color: 'white' } }}>
                        <ListItem button component={Link} to="/">
                            <ListItemText primary="Draft" />
                        </ListItem>
                        <ListItem button component={Link} to="/sealed">
                            <ListItemText primary="Sealed" />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
        </Box>
    );
}
