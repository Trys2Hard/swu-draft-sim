import { Box, Select, InputLabel, FormControl, MenuItem } from '@mui/material';

export default function SelectBase({ base, setBase }) {
    const handleChange = (event) => {
        setBase(event.target.value);
    };

    return (
        <Box sx={{ minWidth: '8rem' }}>
            <FormControl fullWidth>
                <InputLabel id="select-base-label">Select Base</InputLabel>
                <Select
                    labelId="select-base-label"
                    id="select-base"
                    value={base}
                    label="Select Base"
                    onChange={handleChange}
                >
                    <MenuItem value={'SEC_019'}>Rix Road (Vigilance/Blue)</MenuItem>
                    <MenuItem value={'SEC_020'}>Uscru Entertainment District (Vigilance/Blue)</MenuItem>
                    <MenuItem value={'SEC_021'}>Republic City (Command/Green)</MenuItem>
                    <MenuItem value={'SEC_022'}>Senate Rotunda (Command/Green)</MenuItem>
                    <MenuItem value={'SEC_023'}>Imperial Prison Complex (Aggression/Red)</MenuItem>
                    <MenuItem value={'SEC_024'}>Naval Intelligence HQ (Aggression/Red)</MenuItem>
                    <MenuItem value={'SEC_025'}>Amnesty Housing (Cunning/Yellow)</MenuItem>
                    <MenuItem value={'SEC_026'}>Mount Tantiss (Cunning/Yellow)</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}