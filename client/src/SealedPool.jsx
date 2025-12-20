import { Box, Grid, Typography } from '@mui/material';
import CardHover from './CardHover';
import StartCard from './StartCard';
import SelectBase from './SelectBase';
import ExportDropdown from './ExportDropdown';
import CardSort from './CardSort';
import { useState, useEffect } from 'react';
import CardFilter from './FilterButton';
import FilterOptions from './FilterOptions';
import FilterSwitch from './FilterSwitch';

export default function SealedPool({
  handlePopoverClose,
  handlePopoverOpen,
  anchorEl,
  hoveredCard,
  moveToDeck,
  handleStartSealedBuild,
  sealedStarted,
  leaderPacks,
  cardPacks,
  currentSet,
  isLoading,
  base,
  setBase,
  handleImportSealedPool,
  sealedImportStarted,
}) {
  const [sortBy, setSortBy] = useState('Number');
  const [sortedCardPacks, setSortedCardPacks] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [selectedAspects, setSelectedAspects] = useState([]);
  const [selectedCosts, setSelectedCosts] = useState([]);
  const [selectedRarities, setSelectedRarities] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [filterSwitchState, setFilterSwitchState] = useState('and');

  useEffect(() => {
    const initialCards = [...cardPacks]
      .flat()
      .sort(
        (a, b) =>
          (a.cardData?.[sortBy] ?? 0) - (b.cardData?.[sortBy] ?? 0) ||
          (a.cardData?.Number ?? 0) - (b.cardData?.Number ?? 0),
      );

    setSortedCardPacks(initialCards);
  }, [cardPacks, sortBy]);

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
                card?.cardData?.Aspects.length === 0),
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
                card?.cardData?.Aspects.length === 0) ||
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
  ]);

  function handleSort() {
    setSortBy((prev) => (prev === 'Number' ? 'Cost' : 'Number'));
  }

  //Styles
  const styles = {
    sealedPool: {
      position: 'relative',
      minHeight: '100vh',
      color: 'white',
      backgroundColor: 'rgba(29, 64, 77, 1)',
    },
    header: {
      width: '100%',
      height: { xs: '7rem', md: '4rem' },
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      alignItems: 'center',
      justifyContent: 'center',
    },
    sealedContent: {
      position: 'relative',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      p: '0.5rem',
    },
    leaders: {
      position: 'relative',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      mb: '1rem',
      pb: '0.5rem',
      borderBottom: '2px solid white',
    },
    leaderCard: {
      width: '100%',
      borderRadius: '5%',
      cursor: 'pointer',
      '&: hover': {
        outline: '2px solid rgba(61, 178, 255, 1)',
        boxShadow: '0 0 18px rgba(61, 178, 255, 1)',
      },
    },
    loading: {
      position: 'absolute',
      display: isLoading ? 'block' : 'none',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -80%)',
      fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem' },
      textShadow: '2px 2px 3px black',
    },
    nonLeaderCard: {
      width: '100%',
      borderRadius: '5%',
      cursor: 'pointer',
      '&: hover': {
        outline: '2px solid rgba(61, 178, 255, 1)',
        boxShadow: '0 0 18px rgba(61, 178, 255, 1)',
      },
    },
  };

  return (
    <>
      {!sealedStarted && !sealedImportStarted && (
        <StartCard
          cardSet={currentSet}
          handleStartDraft={handleStartSealedBuild}
          handleImportSealedPool={handleImportSealedPool}
        >
          Start Sealed
        </StartCard>
      )}

      {(sealedStarted || sealedImportStarted) && (
        <Box sx={styles.sealedPool}>
          <Box sx={styles.header}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                mb: { xs: '0.8rem', md: '0' },
                fontSize: { xs: '1.6rem', sm: '2.125rem' },
              }}
            >
              {sealedStarted ? 'Generated Sealed Pool' : 'Imported Sealed Pool'}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                position: { xs: 'static', md: 'absolute' },
                top: '0.7rem',
                right: '1rem',
              }}
            >
              <CardFilter />

              <Box sx={{ mr: '1rem' }}>
                <CardSort handleSort={handleSort} />
              </Box>

              <SelectBase
                base={base}
                setBase={setBase}
                currentSet={currentSet}
              />
            </Box>
          </Box>

          <Box>
            <FilterSwitch handleFilter={handleFilter} />
            <FilterOptions
              selectedAspects={selectedAspects}
              setSelectedAspects={setSelectedAspects}
              selectedCosts={selectedCosts}
              setSelectedCosts={setSelectedCosts}
              selectedRarities={selectedRarities}
              setSelectedRarities={setSelectedRarities}
              selectedTypes={selectedTypes}
              setSelectedTypes={setSelectedTypes}
            />
          </Box>

          <Box sx={styles.sealedContent}>
            <Grid
              container
              spacing={{ xs: 0.2, sm: 0.4, lg: 0.8, xl: 1 }}
              sx={styles.leaders}
            >
              <Typography component="p" sx={styles.loading}>
                Loading...
              </Typography>
              {leaderPacks.flat().map((card) => {
                const cardId = `card-id-${card.id}`;
                return (
                  <Grid
                    size={{ xs: 4, md: 2 }}
                    aria-owns={open ? 'mouse-over-popover' : undefined}
                    aria-haspopup="true"
                    onMouseEnter={(e) => handlePopoverOpen(e, card)}
                    onMouseLeave={handlePopoverClose}
                    key={cardId}
                    onClick={() => moveToDeck(card.id)}
                    sx={styles.cardLeaders}
                  >
                    <Box
                      component="img"
                      src={card?.cardData?.FrontArt}
                      id={cardId}
                      sx={styles.leaderCard}
                    />
                  </Grid>
                );
              })}
            </Grid>

            <Grid
              container
              spacing={{ xs: 0.2, sm: 0.4, lg: 0.8, xl: 1 }}
              sx={{ width: '100%' }}
            >
              {filteredCards.map((card) => {
                const cardId = `card-id-${card.id}`;
                return (
                  <Grid
                    size={{ xs: 2, md: 1.2 }}
                    aria-owns={open ? 'mouse-over-popover' : undefined}
                    aria-haspopup="true"
                    onMouseEnter={(e) => handlePopoverOpen(e, card)}
                    onMouseLeave={handlePopoverClose}
                    key={cardId}
                    onClick={() => moveToDeck(card.id)}
                  >
                    <Box
                      component="img"
                      src={card?.cardData?.FrontArt}
                      id={cardId}
                      sx={styles.nonLeaderCard}
                    />
                  </Grid>
                );
              })}
            </Grid>
            <CardHover
              anchorEl={anchorEl}
              hoveredCard={hoveredCard}
              onHoverClose={handlePopoverClose}
            />
            <ExportDropdown
              leaderPacks={leaderPacks}
              sortedCardPacks={sortedCardPacks}
              base={base}
              setBase={setBase}
            />
          </Box>
        </Box>
      )}
    </>
  );
}
