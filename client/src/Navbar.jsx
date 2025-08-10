import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Navbar() {
    // Styles
    const styles = {
        toolbar: {
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
        },
        link: {
            textDecoration: 'none',
            color: 'inherit',
            padding: '0.5rem',
            borderRadius: '20px',
            '&:hover': {
                background: 'linear-gradient(rgba(125, 125, 125, 1), rgba(31, 202, 255, 0.5))',
            },
        },
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ background: 'rgba(42, 9, 86, 1)' }}>
                <Toolbar sx={styles.toolbar}>
                    <Typography component={Link} variant='h6' to='/' sx={styles.link}>Draft</Typography>
                    <Typography component={Link} variant='h6' to='/sealed' sx={styles.link}>Sealed</Typography>
                </Toolbar>
            </AppBar>
        </Box >
    );
}
