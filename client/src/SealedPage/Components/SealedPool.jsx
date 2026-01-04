import { Box, Grid, Typography } from '@mui/material';
import CardHover from '../../Components/CardHover';
import StartCard from '../../Components/StartCard/StartCard';
import SelectBase from './SelectBase';
import ExportDropdown from '../../SealedPage/Components/ExportDropdown';
import CardSort from './CardSort';
import { useState, useEffect } from 'react';
import CardFilter from './Filter/FilterButton';
import FilterOptions from './Filter/FilterOptions';
import LeaderCardContainer from '../../Components/LeaderCardContainer/LeaderCardContainer';

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
  deckLeaders,
}) {
  const [sortBy, setSortBy] = useState('Number');
  const [sortedCardPacks, setSortedCardPacks] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [filterSelected, setFilterSelected] = useState(false);

  const cards = filterSelected ? filteredCards : sortedCardPacks;

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
      height: { xs: '13rem', sm: '7rem', lg: '4rem' },
      display: 'flex',
      flexDirection: { xs: 'column', lg: 'row' },
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
              component="h2"
              sx={{
                mb: { xs: '0.8rem', lg: '0' },
                fontSize: { xs: '1.6rem', sm: '1.8rem' },
              }}
            >
              {sealedStarted ? 'Generated Sealed Pool' : 'Imported Sealed Pool'}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                position: { xs: 'static', lg: 'absolute' },
                top: '0.7rem',
                right: '1rem',
              }}
            >
              <CardFilter
                filterSelected={filterSelected}
                setFilterSelected={setFilterSelected}
              />

              <Box sx={{ m: { xs: '0.5rem', sm: '0 1rem 0 0' } }}>
                <CardSort handleSort={handleSort} />
              </Box>

              <SelectBase
                base={base}
                setBase={setBase}
                currentSet={currentSet}
              />
            </Box>
          </Box>

          <Box
            sx={{
              mt: '0.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {filterSelected && (
              <FilterOptions
                setFilteredCards={setFilteredCards}
                sortedCardPacks={sortedCardPacks}
              />
            )}
          </Box>

          <Box sx={styles.sealedContent}>
            <LeaderCardContainer
              deckLeaders={deckLeaders}
              moveToDeck={moveToDeck}
              handlePopoverOpen={handlePopoverOpen}
              handlePopoverClose={handlePopoverClose}
              leaderPacks={leaderPacks}
              sealedStarted={sealedStarted}
              sealedImportStarted={sealedImportStarted}
              isLoading={isLoading}
            />

            <Grid
              container
              spacing={{ xs: 0.2, sm: 0.4, lg: 0.8, xl: 1 }}
              sx={{ width: '100%' }}
            >
              {cards.map((card) => {
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
