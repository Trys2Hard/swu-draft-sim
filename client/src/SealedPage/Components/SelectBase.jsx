import { Box, Select, InputLabel, FormControl, MenuItem } from '@mui/material';

export default function SelectBase({ base, setBase, currentSet }) {
  const handleChange = (event) => {
    setBase(event.target.value);
  };

  const lofBases = [
    {
      number: 'LOF_020',
      name: 'Nightsister Lair (Vigilance/Blue)',
    },
    {
      number: 'LOF_021',
      name: 'Shadowed Undercity (Vigilance/Blue)',
    },
    {
      number: 'LOF_023',
      name: 'Jedi Temple (Command/Green)',
    },
    {
      number: 'LOF_024',
      name: 'Starlight Temple (Command/Green)',
    },
    {
      number: 'LOF_026',
      name: 'Fortress Vader (Aggression/Red)',
    },
    {
      number: 'LOF_027',
      name: 'Strangled Cliffs (Aggression/Red)',
    },
    {
      number: 'LOF_029',
      name: 'Crystal Caves (Cunning/Yellow)',
    },
    {
      number: 'LOF_030',
      name: 'The Holy City (Cunning/Yellow)',
    },
  ];

  const secBases = [
    {
      number: 'SEC_019',
      name: 'Rix Road (Vigilance/Blue)',
    },
    {
      number: 'SEC_020',
      name: 'Uscru Entertainment District (Vigilance/Blue)',
    },
    {
      number: 'SEC_021',
      name: 'Republic City (Command/Green)',
    },
    {
      number: 'SEC_022',
      name: 'Senate Rotunda (Command/Green)',
    },
    {
      number: 'SEC_023',
      name: 'Imperial Prison Complex (Aggression/Red)',
    },
    {
      number: 'SEC_024',
      name: 'Naval Intelligence HQ (Aggression/Red)',
    },
    {
      number: 'SEC_025',
      name: 'Amnesty Housing (Cunning/Yellow)',
    },
    {
      number: 'SEC_026',
      name: 'Mount Tantiss (Cunning/Yellow)',
    },
  ];

  const baseGroups = {
    lof: lofBases,
    sec: secBases,
  };

  const baseOptions = baseGroups[currentSet];

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
            height: '2.5rem',
            color: 'white',
            backgroundColor: 'rgba(30, 30, 30, 0.4)',
            borderRadius: '10px',
          }}
        >
          {baseOptions.map((b) => (
            <MenuItem key={b.number} value={b.number}>
              {b.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
