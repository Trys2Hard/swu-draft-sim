import {
  Box,
  List,
  ListItem,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function CardSets({ handleSetChange, currentSet }) {
  const isSmallScreen = useMediaQuery('(max-width: 450px)');

  const cardSets = [
    { name: 'sor', logo: '/sor_logo.png' },
    { name: 'shd', logo: '/shd_logo.png' },
    { name: 'lof', logo: '/lof_logo.png' },
    { name: 'sec', logo: '/sec_logo.png' },
    { name: 'law', logo: '/law_logo.png' },
    { name: 'ash', logo: '/ash_logo.png' },
    { name: 'hmw', logo: '/hmw_logo.png' },
  ];

  const styles = {
    cardSets: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      backgroundColor: 'rgb(10, 10, 10)',
      m: '1rem 0',
      p: 0,
    },
    cardSetButton: {
      color: 'inherit',
      width: '12rem',
      flexShrink: 0,
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
    <>
      {isSmallScreen ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <FormControl sx={{ width: '12rem' }}>
            <InputLabel id='choose-set-label' sx={{ color: 'white' }}>
              Choose Set
            </InputLabel>

            <Select
              labelId='choose-set-label'
              value={currentSet}
              label='Choose Set'
              onChange={(e) => handleSetChange(e.target.value)}
              renderValue={(selected) => {
                const selectedSet = cardSets.find(
                  (cardSet) => cardSet.name === selected,
                );

                return (
                  <Box
                    component='img'
                    src={selectedSet.logo}
                    alt={selectedSet.name}
                    sx={{
                      width: '100%',
                      height: '30px',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                );
              }}
              sx={{
                color: 'white',
                backgroundColor: 'rgb(10, 10, 10)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
                '& .MuiSvgIcon-root': {
                  color: 'white',
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: 'rgb(25, 25, 25)',
                  },
                },
              }}
            >
              {cardSets.map((cardSet) => (
                <MenuItem
                  key={cardSet.name}
                  value={cardSet.name}
                  sx={{
                    justifyContent: 'center',
                    py: 1,
                  }}
                >
                  <Box
                    component='img'
                    src={cardSet.logo}
                    alt={cardSet.name}
                    sx={{
                      width: '10rem',
                      height: '30px',
                      objectFit: 'contain',
                    }}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      ) : (
        <List sx={styles.cardSets}>
          {cardSets.map((cardSet) => (
            <ListItem
              key={cardSet.name}
              onClick={() => handleSetChange(cardSet.name)}
              sx={{
                ...styles.cardSetButton,
                backgroundColor:
                  cardSet.name === currentSet
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'transparent',
              }}
            >
              <Box
                component='img'
                src={cardSet.logo}
                alt={`${cardSet.name} logo`}
                sx={{ width: '100%', aspectRatio: '8/2' }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </>
  );
}
