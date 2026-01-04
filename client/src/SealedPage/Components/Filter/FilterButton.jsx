import { Typography, ToggleButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

export default function FilterButton({ filterSelected, setFilterSelected }) {
  return (
    <ToggleButton
      value="check"
      size="small"
      selected={filterSelected}
      onChange={() => setFilterSelected((prevSelected) => !prevSelected)}
      sx={{
        mr: '1rem',
        border: '1px solid rgba(110, 110, 110, 0.7)',
        borderRadius: '10px',
      }}
    >
      <Typography variant="p" component="p" sx={{ color: 'white' }}>
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
