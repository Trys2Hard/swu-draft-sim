import { Box, Typography } from '@mui/material';
import Switch from '@mui/material/Switch';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

export default function CardSort({ handleSort }) {
  return (
    <Box
      sx={{
        height: { xs: '2rem', sm: '2.5rem' },
        width: { xs: '7.8rem', sm: '9rem' },
        display: 'flex',
        alignItems: 'center',
        border: '1px solid var(--off-white)',
        backgroundColor: 'var(--button-gray)',
        borderRadius: '10px',
        p: '0 0.4rem',
      }}
    >
      <Typography sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>
        Num
      </Typography>
      <Switch
        {...label}
        onClick={handleSort}
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
      <Typography sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>
        Cost
      </Typography>
    </Box>
  );
}
