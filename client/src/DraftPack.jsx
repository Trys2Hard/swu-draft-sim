import { useState, useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import CardHover from './CardHover';
import StartCard from './StartCard';
import LeaderCardContainer from './LeaderCardContainer';

export default function DraftPack({
  packNum,
  pickNum,
  handleStartDraft,
  draftStarted,
  draftingLeaders,
  currentPack,
  packIndex,
  handlePopoverClose,
  handlePopoverOpen,
  pickCard,
  anchorEl,
  hoveredCard,
  isLoading,
  currentSet,
}) {
  const layout1 = draftingLeaders ? 4 : 2.4;
  const layout2 = draftingLeaders ? 4 : 12 / 7;
  const [layout, setLayout] = useState(layout1);

  const draftEnded = packNum === 3 && pickNum === 15;

  useEffect(() => {
    setLayout(layout1);
  }, [layout1]);

  const handleLayout = () =>
    setLayout((prev) => (prev === layout1 ? layout2 : layout1));

  //Styles
  const styles = {
    packBox: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '100%',
      minHeight: '100vh',
      m: '0 auto 1rem auto',
      // backgroundImage: !draftStarted ? 'url(/LOF_box_art_card.jpg)' : 'url(/LOF_box_art_full.jpg)',
      backgroundImage:
        currentSet === 'sec'
          ? 'url(/SEC_box_art_full.jpg)'
          : 'url(lof_box_wide.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center top',
      backgroundRepeat: 'no-repeat',
      color: 'white',
    },
    draftContent: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width:
        layout === layout2
          ? { xs: '100%', md: '900px' }
          : draftingLeaders
            ? { xs: '100%', md: '75%', lg: '60%' }
            : { xs: '80%', md: '900px' },
      height: draftingLeaders || draftEnded ? '100vh' : '100%',
    },
    packInfo: {
      mt: '1rem',
      boxShadow: '-3px 3px 5px black',
      backgroundColor: 'rgba(58, 58, 58, 1)',
      p: {
        xs: '0.4rem 1.7rem 0.4rem 1.7rem',
        sm: '0.7rem 2.7rem 0.7rem 2.7rem',
      },
      borderRadius: '10px',
      fontSize: { xs: '0.7rem', sm: '1rem' },
      border: '1px solid rgba(61, 178, 255, 0.5)',
    },
    layoutButton: {
      position: 'absolute',
      display: !draftingLeaders ? 'block' : 'none',
      top: { xs: '1.6rem', sm: '2.2rem' },
      right: '0.7rem',
      background: 'rgba(0, 0, 0, 1)',
      borderRadius: '3px',
      cursor: 'pointer',
      outline: '1px solid rgba(61, 178, 255, 0.8)',
      transition: 'all 0.3s',
      '&:hover': {
        color: 'rgba(61, 178, 255, 0.8)',
      },
    },
    draftEnd: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      textShadow: '3px 3px 5px black',
      fontSize: { xs: '2.5rem', md: '3.5rem' },
      whiteSpace: 'nowrap',
    },
  };

  return (
    <>
      {!draftStarted && (
        <StartCard
          cardSet={currentSet}
          isLoading={isLoading}
          handleStartDraft={handleStartDraft}
        >
          Start Draft
        </StartCard>
      )}

      {draftStarted && (
        <Box sx={styles.packBox}>
          <Box sx={styles.draftContent}>
            <Box sx={{ display: draftEnded && 'none' }}>
              <Typography variant="h5" component="h3" sx={styles.packInfo}>
                Pack {packNum} / Pick {pickNum}
              </Typography>
              {layout === layout1 ? (
                <GridViewIcon
                  fontSize="medium"
                  sx={styles.layoutButton}
                  onClick={handleLayout}
                />
              ) : (
                <ViewAgendaIcon
                  fontSize="medium"
                  sx={styles.layoutButton}
                  onClick={handleLayout}
                />
              )}
            </Box>

            <LeaderCardContainer
              handlePopoverOpen={handlePopoverOpen}
              handlePopoverClose={handlePopoverClose}
              draftStarted={draftStarted}
              currentPack={currentPack}
              packIndex={packIndex}
              pickCard={pickCard}
              draftingLeaders={draftingLeaders}
              isLoading={isLoading}
              layout={layout}
            />
            <CardHover
              anchorEl={anchorEl}
              hoveredCard={hoveredCard}
              onHoverClose={handlePopoverClose}
            />

            {draftEnded && (
              <Typography component="h2" sx={styles.draftEnd}>
                Draft Complete!
              </Typography>
            )}
          </Box>
        </Box>
      )}
    </>
  );
}
