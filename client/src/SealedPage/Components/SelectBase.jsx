import { Box, Select, InputLabel, FormControl, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';

export default function SelectBase({
  base,
  setBase,
  currentSet,
  baseColor,
  setBaseColor,
}) {
  const [bases, setBases] = useState([]);

  const handleChange = (event) => {
    setBase(event.target.value);
  };

  useEffect(() => {
    const fetchBases = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/bases/${currentSet}`,
        );

        if (!res.ok) {
          throw new Error('Failed to fetch bases');
        }

        const data = await res.json();
        setBases(data.sort((a, b) => a.Number - b.Number));
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchBases();
  }, [currentSet]);

  const aspectColorMap = new Map();

  aspectColorMap.set('Vigilance', 'rgba(45, 136, 255, 1)');
  aspectColorMap.set('Cunning', 'rgba(231, 228, 46, 1)');
  aspectColorMap.set('Aggression', 'rgba(233, 36, 36, 1)');
  aspectColorMap.set('Command', 'rgba(40, 224, 40, 1)');

  // Check if the current base value exists in the loaded bases
  const displayValue = bases.length > 0 ? base : '';

  return (
    <Box>
      <FormControl
        size='small'
        sx={{
          height: { xs: '2rem', sm: '2.5rem' },
          width: { xs: '6.5rem', sm: '8.3rem' },

          // Labels
          '& .MuiInputLabel-root': {
            color: 'white',
            '&.Mui-focused': {
              color: 'white',
            },
          },

          // Outline borders
          '& .MuiOutlinedInput-notchedOutline': {
            border: `1px solid ${baseColor}`,
          },

          '& .MuiOutlinedInput-root': {
            '&:hover .MuiOutlinedInput-notchedOutline': {
              border: `2px solid ${baseColor}`,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: `${baseColor}`,
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
          value={displayValue}
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
              onClick={() => setBaseColor(aspectColorMap.get(b.Aspects[0]))}
              sx={{
                color: aspectColorMap.get(b.Aspects[0]),
                '&:hover': { backgroundColor: 'rgba(10, 10, 10, 1)' },
              }}
            >
              {b.Name}{' '}
              {b.Rarity === 'Rare'
                ? '(R)'
                : b.Rarity === 'Special'
                  ? '(S)'
                  : null}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
