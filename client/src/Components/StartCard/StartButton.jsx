import { Button } from '@mui/material';

export default function StartButton({ isLoading, onClick, children }) {
  //Styles
  const styles = {
    startButton: {
      display: isLoading ? 'none' : 'flex',
      mb: '1rem',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      textShadow: '2px 2px 3px black',
      borderRadius: '20px',
      outline: '1px solid rgba(31, 202, 255, 1)',
      transition: 'all 0.5s',
      '&:hover': {
        p: '1rem',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        boxShadow: '0 0 30px rgba(31, 202, 255, 1)',
      },
    },
  };

  return (
    <Button variant="contained" sx={styles.startButton} onClick={onClick}>
      {children}
    </Button>
  );
}
