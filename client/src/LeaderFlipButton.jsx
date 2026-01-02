import RefreshIcon from '@mui/icons-material/Refresh';

export default function LeaderFlipButton({ id, handleFlipLeader }) {
  //Styles
  const styles = {
    flipButton: {
      mt: '0.4rem',
      p: '0.1rem',
      backgroundColor: 'rgba(20, 20, 20, 1)',
      borderRadius: '50%',
      cursor: 'pointer',
      fontSize: { xs: '1.3rem', sm: '1.8rem', md: '2.2rem' },
      transition: 'color 0.3s ease',
      '&:hover': {
        color: 'rgba(61, 178, 255, 1)',
      },
    },
  };

  return (
    <RefreshIcon sx={styles.flipButton} onClick={() => handleFlipLeader(id)} />
  );
}
