import { Box, Typography } from '@mui/material';
import Switch from '@mui/material/Switch';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

export default function FilterSwitch({ handleFilter }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        border: '1px solid rgba(110, 110, 110, 1)',
        backgroundColor: 'rgba(30, 30, 30, 0.4)',
        borderRadius: '10px',
        p: '0 0.4rem',
        width: '8rem',
      }}
    >
      <Typography>And</Typography>
      <Switch
        {...label}
        onClick={handleFilter}
        sx={{
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: 'rgba(61, 178, 255, 1)',
            '&:hover': {
              backgroundColor: 'rgba(61, 178, 255, 0.1)',
            },
          },
          '& .MuiSwitch-switchBase': {
            color: 'rgba(61, 178, 255, 1)',
            '&:hover': {
              backgroundColor: 'rgba(61, 178, 255, 0.1)',
            },
          },
          '& .MuiSwitch-switchBase + .MuiSwitch-track': {
            backgroundColor: 'rgba(61, 178, 255, 1)',
          },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: 'rgba(61, 178, 255, 1)',
          },
        }}
      />
      <Typography>Or</Typography>
    </Box>
  );
}
