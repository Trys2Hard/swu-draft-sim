import { Typography, ToggleButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

export default function FilterButton({ filterSelected, setFilterSelected }) {
  return (
    <ToggleButton
      value='check'
      selected={filterSelected}
      onChange={() => setFilterSelected((prevSelected) => !prevSelected)}
      sx={{
        height: { xs: '2rem', sm: '2.5rem' },
        width: { xs: '5rem', sm: '5.5rem' },
        fontSize: { xs: '0.7rem', sm: '0.9rem' },
        border: '1px solid var(--off-white)',
        backgroundColor: 'var(--button-gray)',
        borderRadius: '10px',
        '&:hover': {
          backgroundColor: 'var(--button-gray)',
          border: '2px solid var(--off-white)',
        },
        '&.Mui-selected:hover': {
          backgroundColor: 'var(--button-gray)',
          border: '2px solid var(--off-white)',
        },
        '&.Mui-selected': {
          backgroundColor: 'var(--button-gray)',
        },
      }}
    >
      <Typography variant='p' component='p' sx={{ color: 'white' }}>
        Filter
      </Typography>
      {filterSelected ? (
        <ExpandLessIcon sx={{ color: 'white' }} />
      ) : (
        <ExpandMoreIcon sx={{ color: 'white' }} />
      )}
    </ToggleButton>
  );
}
