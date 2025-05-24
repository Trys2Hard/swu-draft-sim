import { Box, Typography } from '@mui/material';

export default function Footer() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', background: 'rgba(55, 55, 55, 1)', p: '0.5rem', mt: '1rem', color: 'white' }}>
            <Typography>
                Karabast is in no way affiliated with Disney or Fantasy Flight Games.
                Star Wars characters, cards, logos, and art are property of Disney and/or Fantasy Flight Games.
            </Typography>
        </Box>
    );
};
