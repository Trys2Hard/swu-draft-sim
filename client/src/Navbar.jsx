import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Navbar() {
    // Styles
    const styles = {
        appBar: {
            background: 'linear-gradient(to right, rgba(31, 202, 255, 0.1), rgba(31, 202, 255, 0.4), rgba(31, 202, 255, 0.1))',
        },
        toolbar: {
            display: 'flex',
            alignItems: 'center',
        },
        link: {
            textDecoration: 'none',
            color: 'inherit',
            padding: '0.4rem',
            borderRadius: '20px',
            transition: 'background-color 0.3s',
            m: '0.2rem',
            '&:hover': {
                backgroundColor: 'rgba(31, 202, 255, 0.1)',
            },
        },
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={styles.appBar}>
                <Toolbar sx={styles.toolbar}>
                    <Box component='img' src='swudraftsim-logo.png' sx={{ width: '3rem', mr: '0.3rem' }} />
                    <Typography variant='h5' component='p' >SWU Draft Sim</Typography>
                    <Box sx={{ ml: '1.5rem' }}>
                        <Typography component={Link} variant='h6' to='/' sx={styles.link}>Draft</Typography>
                        <Typography component={Link} variant='h6' to='/sealed' sx={styles.link}>Sealed</Typography>
                        <Typography component={Link} variant='h6' to='/card-search' sx={styles.link}>Card Search</Typography>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
