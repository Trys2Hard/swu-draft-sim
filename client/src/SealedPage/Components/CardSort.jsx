import { Box, Typography } from '@mui/material';
import Switch from '@mui/material/Switch';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

export default function CardSort({ handleSort }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        border: '1px solid rgba(110, 110, 110, 0.7)',
        borderRadius: '10px',
        p: '0 0.4rem',
      }}
    >
      <Typography>Num</Typography>
      <Switch {...label} onClick={handleSort} />
      <Typography>Cost</Typography>
    </Box>
  );
}
