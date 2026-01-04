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
        size="small"
        variant="filled"
        sx={{
          width: '10rem',

          // Label default + focused
          '& .MuiInputLabel-root': {
            color: 'white',
          },

          '& .MuiInputLabel-root.Mui-focused': {
            color: 'white',
          },

          // Target the outlined input root, then the notched outline inside it:
          '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white',
          },

          // Hover state on the root that contains the outline:
          '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(61, 178, 255, 1)',
          },

          // Focused state: the root gets .Mui-focused
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
            {
              borderColor: 'rgba(61, 178, 255, 1)',
              borderWidth: '2px',
            },

          // Arrow color
          '& .MuiSvgIcon-root': {
            color: 'white',
          },
        }}
      >
        <InputLabel id="select-base-label">Select Base</InputLabel>
        <Select
          labelId="select-base-label"
          id="select-base"
          value={base}
          name="base"
          label="Select Base"
          onChange={handleChange}
          sx={{
            color: 'white',
            backgroundColor: 'rgba(65, 65, 65, 1)',
            borderRadius: '5px',
            transition: 'all 0.3s ease-in-out',
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
