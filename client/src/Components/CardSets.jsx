import { Box, List, ListItem } from '@mui/material';

export default function CardSets({ handleSetChange, currentSet }) {
  const cardSets = [
    {
      name: 'lof',
      logo: '/lof_logo.png',
    },
    {
      name: 'sec',
      logo: '/sec_logo.png',
    },
    {
      name: 'law',
      logo: '/law_logo.png',
    },
  ];

  //Styles
  const styles = {
    cardSets: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      backgroundColor: 'rgb(10, 10, 10)',
      m: '1rem 0 1rem 0',
    },
    cardSetButton: {
      color: 'inherit',
      width: '12rem',
      m: '0.5rem',
      borderRadius: '20px',
      cursor: 'pointer',
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        filter: 'brightness(1.1)',
      },
    },
  };

  return (
    <List sx={styles.cardSets}>
      {cardSets.map((cardSet) => {
        return (
          <ListItem
            key={cardSet.name}
            sx={{
              ...styles.cardSetButton,
              backgroundColor:
                cardSet.name === currentSet
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'none',
            }}
          >
            <Box
              component='img'
              src={cardSet.logo}
              value={cardSet.name}
              onClick={() => handleSetChange(cardSet.name)}
              sx={{ width: '100%', aspectRatio: '8/2' }}
            />
          </ListItem>
        );
      })}
    </List>
  );
}
