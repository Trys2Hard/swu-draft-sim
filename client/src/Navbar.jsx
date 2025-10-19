import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Navbar() {
    // Styles
    const styles = {
        appBar: {
            background: 'linear-gradient(to right, rgba(31, 202, 255, 0.1), rgba(31, 202, 255, 0.4), rgba(31, 202, 255, 0.1))',
            mb: '1rem',
        },
        toolbar: {
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
    }

    return (
        <Box>
            <AppBar position="static" sx={styles.appBar}>
                <Toolbar sx={styles.toolbar}>
                    <Box component='img' src='swudraftsim-logo.png' sx={{ width: '3.5rem', mr: '0.2rem' }} />
                    <Typography variant='h5' component='p' sx={{ display: { xs: 'none', sm: 'block' } }} >SWUDraftSim</Typography>
                    <Box sx={{ ml: '1.5rem' }}>
                        <Typography component={Link} variant='h6' to='/' sx={styles.link}>Draft</Typography>
                        <Typography component={Link} variant='h6' to='/sealed' sx={styles.link}>Sealed</Typography>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
