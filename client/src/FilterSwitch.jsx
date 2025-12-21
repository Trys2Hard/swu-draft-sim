import { Box, Typography } from '@mui/material';
import Switch from '@mui/material/Switch';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

export default function FilterSwitch({ handleFilter }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        border: '1px solid rgba(110, 110, 110, 0.7)',
        borderRadius: '10px',
        p: '0 0.4rem',
        width: '8rem',
      }}
    >
      <Typography>And</Typography>
      <Switch {...label} onClick={handleFilter} />
      <Typography>Or</Typography>
    </Box>
  );
}
