import { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  FormGroup,
  FormLabel,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import FilterSwitch from '../../Components/Filter/FilterSwitch';

const costOptions = ['1', '2', '3', '4', '5', '6', '7'];
const rarityOptions = ['Common', 'Uncommon', 'Rare', 'Legendary', 'Special'];
const aspectOptions = [
  'Vigilance',
  'Command',
  'Aggression',
  'Cunning',
  'Villainy',
  'Heroism',
  'Neutral',
];
const typeOptions = ['Unit', 'Upgrade', 'Event'];

export default function FilterOptions({ setFilteredCards, sortedCardPacks }) {
  const [filterSwitchState, setFilterSwitchState] = useState('and');
  const [selectedAspects, setSelectedAspects] = useState([]);
  const [selectedCosts, setSelectedCosts] = useState([]);
  const [selectedRarities, setSelectedRarities] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  const handleAspectToggle = (aspect, checked) => {
    setSelectedAspects((prev) =>
      checked ? [...prev, aspect] : prev.filter((a) => a !== aspect),
    );
  };

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

  const handleTypeToggle = (type, checked) => {
    setSelectedTypes((prev) =>
      checked ? [...prev, type] : prev.filter((t) => t !== type),
    );
  };

  function handleFilter() {
    if (filterSwitchState === 'and') {
      setFilterSwitchState('or');
    } else {
      setFilterSwitchState('and');
    }
  }

  // Apply filtering 'AND'
  useEffect(() => {
    if (filterSwitchState === 'and') {
      if (
        selectedAspects.length === 0 &&
        selectedCosts.length === 0 &&
        selectedRarities.length === 0 &&
        selectedTypes.length === 0
      ) {
        setFilteredCards(sortedCardPacks);
      } else {
        setFilteredCards(
          sortedCardPacks.filter(
            (card) =>
              (selectedAspects.every((aspect) =>
                card?.cardData?.Aspects?.includes(aspect),
              ) &&
                (selectedCosts.length === 0 ||
                  selectedCosts.length === 0 ||
                  selectedCosts.includes(card?.cardData?.Cost)) &&
                (selectedRarities.length === 0 ||
                  selectedRarities.includes(card?.cardData?.Rarity)) &&
                (selectedTypes.length === 0 ||
                  selectedTypes.includes(card?.cardData?.Type))) ||
              (selectedAspects.includes('Neutral') &&
                card?.cardData?.Aspects?.length === 0),
          ),
        );
      }
    }
  }, [
    selectedAspects,
    selectedCosts,
    selectedRarities,
    selectedTypes,
    sortedCardPacks,
    filterSwitchState,
    setFilteredCards,
  ]);

  // Apply filtering 'OR'
  useEffect(() => {
    if (filterSwitchState === 'or') {
      if (
        selectedAspects.length === 0 &&
        selectedCosts.length === 0 &&
        selectedRarities.length === 0 &&
        selectedTypes.length === 0
      ) {
        setFilteredCards(sortedCardPacks);
      } else {
        setFilteredCards(
          sortedCardPacks.filter(
            (card) =>
              card?.cardData?.Aspects?.some((aspect) =>
                selectedAspects.includes(aspect),
              ) ||
              (selectedAspects.includes('Neutral') &&
                card?.cardData?.Aspects?.length === 0) ||
              selectedCosts.includes(card?.cardData?.Cost) ||
              selectedRarities.includes(card?.cardData?.Rarity) ||
              selectedTypes.includes(card?.cardData?.Type),
          ),
        );
      }
    }
  }, [
    selectedAspects,
    selectedCosts,
    selectedRarities,
    selectedTypes,
    sortedCardPacks,
    filterSwitchState,
    setFilteredCards,
  ]);

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      m: '1rem auto 0 auto',
      p: '1rem 1rem 0 1rem',
      border: '1px solid rgba(110, 110, 110, 1)',
      borderRadius: '10px',
    },
    checkboxContainer: {
      display: 'flex',
      flexDirection: 'row',
      p: '0.4rem 0 0.4rem 0.8rem',
      backgroundColor: 'rgba(30, 30, 30, 0.2)',
      borderRadius: '5px',
      mb: '1rem',
      ml: { md: '1rem' },
    },
    filterLabel: {
      color: 'white',
      fontWeight: 'bold',
      ml: { xs: '0.25rem', md: '1.25rem' },
      mb: '0.25rem',
      '&.Mui-focused': {
        color: 'white',
      },
    },
    checkbox: {
      color: 'white',
      p: '0.4rem',
      transition: 'background-color 0.3s',
      '&.Mui-checked': { color: 'rgba(61, 178, 255, 1)' },
      '&:hover': {
        backgroundColor: 'rgba(61, 178, 255, 0.1)',
      },
    },
  };

  return (
    <>
      <FilterSwitch handleFilter={handleFilter} />
      <Box component='form' sx={styles.container}>
        <Box>
          {/* Aspect FILTER */}
          <FormControl component='fieldset'>
            <FormLabel component='legend' sx={styles.filterLabel}>
              Aspect
            </FormLabel>
            <FormGroup sx={styles.checkboxContainer}>
              {aspectOptions.map((aspect) => (
                <FormControlLabel
                  key={aspect}
                  label={aspect}
                  control={
                    <Checkbox
                      sx={styles.checkbox}
                      checked={selectedAspects.includes(aspect)}
                      onChange={(e) =>
                        handleAspectToggle(aspect, e.target.checked)
                      }
                    />
                  }
                />
              ))}
            </FormGroup>
          </FormControl>

          {/* Type FILTER */}
          <FormControl component='fieldset'>
            <FormLabel component='legend' sx={styles.filterLabel}>
              Type
            </FormLabel>
            <FormGroup sx={styles.checkboxContainer}>
              {typeOptions.map((type) => (
                <FormControlLabel
                  key={type}
                  label={type}
                  control={
                    <Checkbox
                      sx={styles.checkbox}
                      checked={selectedTypes.includes(type)}
                      onChange={(e) => handleTypeToggle(type, e.target.checked)}
                    />
                  }
                />
              ))}
            </FormGroup>
          </FormControl>
        </Box>

        <Box>
          {/* COST FILTER */}
          <FormControl component='fieldset' sx={styles.filterOption}>
            <FormLabel component='legend' sx={styles.filterLabel}>
              Cost
            </FormLabel>
            <FormGroup sx={styles.checkboxContainer}>
              {costOptions.map((cost) => (
                <FormControlLabel
                  key={cost}
                  label={parseInt(cost) < 7 ? cost : '7+'}
                  control={
                    <Checkbox
                      sx={styles.checkbox}
                      checked={selectedCosts.includes(cost)}
                      onChange={(e) => handleCostToggle(cost, e.target.checked)}
                    />
                  }
                />
              ))}
            </FormGroup>
          </FormControl>

          {/* RARITY FILTER */}
          <FormControl component='fieldset'>
            <FormLabel component='legend' sx={styles.filterLabel}>
              Rarity
            </FormLabel>
            <FormGroup sx={styles.checkboxContainer}>
              {rarityOptions.map((rarity) => (
                <FormControlLabel
                  key={rarity}
                  label={rarity}
                  control={
                    <Checkbox
                      sx={styles.checkbox}
                      checked={selectedRarities.includes(rarity)}
                      onChange={(e) =>
                        handleRarityToggle(rarity, e.target.checked)
                      }
                    />
                  }
                />
              ))}
            </FormGroup>
          </FormControl>
        </Box>
      </Box>
    </>
  );
}
