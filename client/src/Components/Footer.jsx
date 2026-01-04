import { Box, Typography } from '@mui/material';

export default function Footer() {
  const styles = {
    footer: {
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: 'rgba(90, 90, 90, 1)',
      p: '0.5rem',
      mt: '2rem',
      color: 'white',
    },
  };

  return (
    <Box sx={styles.footer}>
      <Typography>
        swudraftsim.com is an unofficial fan site not endorsed by or affiliated
        with Disney or Fantasy Flight Games. Star Wars characters, cards, logos,
        and art are trademarks of Disney and/or Fantasy Flight Games.
      </Typography>
    </Box>
  );
}
