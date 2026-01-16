import { Box, Select, InputLabel, FormControl, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';

export default function SelectBase({ base, setBase, currentSet }) {
  const [bases, setBases] = useState([]);

  const handleChange = (event) => {
    setBase(event.target.value);
  };

  useEffect(() => {
    const fetchBases = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/bases/${currentSet}`
        );

        if (!res.ok) {
          throw new Error('Failed to fetch bases');
        }

        const data = await res.json();
        setBases(data);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchBases();
  }, [currentSet]);

  const aspectColorMap = new Map();

  aspectColorMap.set('Vigilance', 'rgb(99, 147, 238)');
  aspectColorMap.set('Cunning', 'rgb(248, 245, 86)');
  aspectColorMap.set('Aggression', 'rgb(238, 99, 99)');
  aspectColorMap.set('Command', 'rgb(99, 238, 106)');

  return (
    <Box>
      <FormControl
        size='small'
        sx={{
          height: '2.5rem',
          width: '8.3rem',

          // Labels
          '& .MuiInputLabel-root': {
            color: 'white',
            '&.Mui-focused': {
              color: 'white',
            },
          },

          // Outline borders
          '& .MuiOutlinedInput-notchedOutline': {
            border: '1px solid rgba(110, 110, 110, 1)',
            // border: base ? '1px solid red' : '1px solid rgba(110, 110, 110, 1)',
          },

          '& .MuiOutlinedInput-root': {
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgb(61, 178, 255)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgb(61, 178, 255)',
              // borderColor: base ? 'red' : 'rgb(61, 178, 255)',
            },
          },

          // Dropdown arrow
          '& .MuiSvgIcon-root': {
            color: 'white',
          },
        }}
      >
        <InputLabel id='select-base-label'>Select Base</InputLabel>
        <Select
          labelId='select-base-label'
          id='select-base'
          value={base}
          name='base'
          label='Select Base'
          onChange={handleChange}
          sx={{
            height: '100%',
            color: 'white',
            backgroundColor: 'rgba(30, 30, 30, 0.4)',
            borderRadius: '10px',
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                backgroundColor: 'rgba(10, 10, 10, 0.9)',
              },
            },
          }}
        >
          {bases.map((b) => (
            <MenuItem
              key={b.Number}
              value={`${b.Set}_${b.Number}`}
              sx={{
                color: aspectColorMap.get(b.Aspects[0]),
                '&:hover': { backgroundColor: 'rgba(10, 10, 10, 1)' },
              }}
            >
              {b.Name}{' '}
              {b.Rarity === 'Rare'
                ? ' (R)'
                : b.Rarity === 'Special'
                ? ' (S)'
                : null}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
