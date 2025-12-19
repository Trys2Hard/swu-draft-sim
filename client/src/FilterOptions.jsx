import {
  Box,
  FormControl,
  FormGroup,
  FormLabel,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

const costOptions = ['1', '2', '3', '4', '5', '6', '7'];
const rarityOptions = ['Common', 'Uncommon', 'Rare', 'Legendary', 'Special'];

export default function FilterOptions({
  selectedCosts,
  setSelectedCosts,
  selectedRarities,
  setSelectedRarities,
}) {
  const handleCostToggle = (cost, checked) => {
    setSelectedCosts((prev) =>
      checked ? [...prev, cost] : prev.filter((c) => c !== cost),
    );
  };

  const handleRarityToggle = (rarity, checked) => {
    setSelectedRarities((prev) =>
      checked ? [...prev, rarity] : prev.filter((r) => r !== rarity),
    );
  };

  return (
    <Box component="form">
      {/* COST FILTER */}
      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <FormLabel component="legend">Cost</FormLabel>
        <FormGroup>
          {costOptions.map((cost) => (
            <FormControlLabel
              key={cost}
              label={parseInt(cost) < 7 ? cost : '7+'}
              control={
                <Checkbox
                  checked={selectedCosts.includes(cost)}
                  onChange={(e) => handleCostToggle(cost, e.target.checked)}
                />
              }
            />
          ))}
        </FormGroup>
      </FormControl>

      {/* RARITY FILTER */}
      <FormControl component="fieldset">
        <FormLabel component="legend">Rarity</FormLabel>
        <FormGroup>
          {rarityOptions.map((rarity) => (
            <FormControlLabel
              key={rarity}
              label={rarity}
              control={
                <Checkbox
                  checked={selectedRarities.includes(rarity)}
                  onChange={(e) => handleRarityToggle(rarity, e.target.checked)}
                />
              }
            />
          ))}
        </FormGroup>
      </FormControl>
    </Box>
  );
}
