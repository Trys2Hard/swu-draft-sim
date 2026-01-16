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
        mr: '0.5rem',
        height: '2.2rem',
        width: '5.5rem',
        border: '1px solid rgba(110, 110, 110, 1)',
        backgroundColor: 'rgba(30, 30, 30, 0.4)',
        borderRadius: '10px',
        '&:hover': {
          backgroundColor: 'rgba(30, 30, 30, 0.4)',
          borderColor: 'rgb(61, 178, 255)',
        },
        '&.Mui-selected:hover': {
          backgroundColor: 'rgba(30, 30, 30, 0.4)',
          borderColor: 'rgb(61, 178, 255)',
        },
        '&.Mui-selected': {
          backgroundColor: 'rgba(30, 30, 30, 0.4)',
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
