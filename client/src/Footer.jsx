import { Box, Typography } from '@mui/material';

export default function Footer() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', background: 'rgba(73, 73, 73, 1)', p: '0.5rem', mt: '5rem', color: 'white' }}>
            <Typography>
                swudraftsim.com is in no way affiliated with Disney or Fantasy Flight Games.
                Star Wars characters, cards, logos, and art are property of Disney and/or Fantasy Flight Games.
            </Typography>
        </Box>
    );
};
