import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { Typography, Box } from '@mui/material';
import Deck from '../Components/Deck/Deck';
import { useCardHoverPopover } from '../Hooks/useCardHoverPopover';
import { useCreatePacks } from '../Hooks/useCreatePacks';
import CardSets from '../Components/CardSets';
import { v4 as uuid } from 'uuid';
import DraftPack from '../DraftPage/DraftPack';
import Sideboard from '../DraftPage/Sideboard';

export default function DraftPage() {
  const [deckLeaders, setDeckLeaders] = useState([]);
  const [deckCards, setDeckCards] = useState([]);
  const [pickNum, setPickNum] = useState(1);
  const [packNum, setPackNum] = useState(0);
  const [title, setTitle] = useState('Leaders');
  const [packIndex, setPackIndex] = useState(0);
  const [draftStarted, setDraftStarted] = useState(false);
  const [sideboardLeaders, setSideboardLeaders] = useState([]);
  const [sideboardCards, setSideboardCards] = useState([]);
  const [flippedLeaders, setFlippedLeaders] = useState({});
  const [base, setBase] = useState('');
  const [baseColor, setBaseColor] = useState('var(--off-white)');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { anchorEl, hoveredCard, handlePopoverOpen, handlePopoverClose } =
    useCardHoverPopover('');
  const {
    currentSet,
    setCurrentSet,
    generateLeaderPack,
    generateCardPack,
    leaderPacks,
    setLeaderPacks,
    cardPacks,
    setCardPacks,
    isLoading,
    resetCardPacks,
    resetSeenIds,
    setIsLoading,
  } = useCreatePacks('');

  const leadersDrafted =
    draftStarted && leaderPacks.every((arr) => arr.length === 0);
  // During transition, show empty array to prevent flash of old data
  const currentPack = isTransitioning
    ? []
    : leadersDrafted
      ? cardPacks
      : leaderPacks;
  const draftingLeaders =
    draftStarted && leaderPacks.every((arr) => arr.length > 0);

  let errorCount = 0;

  useEffect(() => {
    if (cardPacks.length === 8) {
      setIsLoading(false);
      setIsTransitioning(false);
    }
  }, [cardPacks, setIsLoading]);

  useEffect(() => {
    if (leaderPacks.length === 8) {
      setIsLoading(false);
    }
  }, [leaderPacks, setIsLoading]);

  function handleStartDraft() {
    setDraftStarted(true);

    for (let i = 0; i < 8; i++) {
      generateLeaderPack(3);
    }

    if (errorCount > 0) {
      alert(`${errorCount} leader${errorCount > 1 ? 's' : ''} failed to load.`);
    }
  }

  function handleSetChange(newSet) {
    setCurrentSet(newSet);
  }

  const handleFlipLeader = (id) => {
    setFlippedLeaders((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  function pickCard(id) {
    handlePopoverClose();

    let pickedCard = currentPack[packIndex]?.find((card) => card.id === id);
    if (!pickedCard) return;

    let addCard = leadersDrafted ? setDeckCards : setDeckLeaders;
    let packs = leadersDrafted ? cardPacks : leaderPacks;
    let setPacks = leadersDrafted ? setCardPacks : setLeaderPacks;

    if (packs.length === 8) {
      // Handle duplicate IDs
      const dupId = deckCards.some((c) => c.id === pickedCard.id);
      if (dupId) {
        pickedCard = { ...pickedCard, id: uuid() };
      }

      addCard((prev) => [...prev, pickedCard]);

      // Create new packs array with card removed - IMMUTABLE UPDATE
      const newPacks = packs.map((pack, index) => {
        if (index === packIndex) {
          // Remove the picked card from current pack
          return pack.filter((card) => card.id !== id);
        } else {
          // Bot picks from other packs
          const cardPick = pack.reduce((highest, card) => {
            if (
              !highest ||
              (card.cardData?.Rank ?? 0) > (highest.cardData?.Rank ?? 0)
            ) {
              return card;
            }
            return highest;
          }, null);

          // Remove bot's picked card
          return pack.filter((card) => card.id !== cardPick?.id);
        }
      });

      // Check if leaders are done and need to transition to cards
      // Check BEFORE updating state to prevent UI flicker
      const isLeadersFinished =
        draftStarted &&
        !leadersDrafted &&
        newPacks.every((arr) => arr.length === 0) &&
        pickNum < 15 &&
        cardPacks.length === 0;

      if (isLeadersFinished) {
        // CRITICAL: Set transition flag FIRST to prevent currentPack from showing old data
        setIsTransitioning(true);

        // Use flushSync to ensure loading is set synchronously
        // This prevents React from batching updates and causing a flash
        setIsLoading(true);
        resetCardPacks();

        resetSeenIds();
        setTitle('Cards');

        // Set packNum to 1 for first card pack and reset pickNum to 1
        setPackNum(1);
        setPickNum(1);
        setPackIndex(0);

        // Now update leader packs (this will cause currentPack to switch to empty cardPacks)
        // Use flushSync to ensure this happens after loading is set
        flushSync(() => {
          setPacks(newPacks);
        });

        // Transition flag will be cleared when cardPacks.length === 8

        // Generate all packs and wait for completion
        const packPromises = [];
        for (let i = 0; i < 8; i++) {
          packPromises.push(generateCardPack());
        }

        // Wait for all packs to finish, then turn off loading
        Promise.all(packPromises).catch((error) => {
          console.error('Error generating card packs:', error);
        });

        return;
      }

      // Update state with new packs (for normal picks)
      setPacks(newPacks);
      setPackIndex((prev) => (prev === 7 ? 0 : prev + 1));

      setPickNum((prev) => prev + 1);

      // Check if pack is complete (for card packs)
      if (
        draftStarted &&
        leadersDrafted &&
        newPacks.every((arr) => arr.length === 0) &&
        packNum < 3
      ) {
        setPackNum((prev) => prev + 1);
        setPickNum(1);
        setPackIndex(0);
        resetCardPacks();
        resetSeenIds();

        // Set loading before generating all packs
        setIsLoading(true);

        // Generate all packs and wait for completion
        const packPromises = [];
        for (let i = 0; i < 8; i++) {
          packPromises.push(generateCardPack());
        }

        // Wait for all packs to finish, then turn off loading
        Promise.all(packPromises).finally(() => {
          setIsLoading(false);
        });
      }
    }
  }

  return (
    <>
      <Box>
        <Typography
          variant='h4'
          component='h1'
          sx={{ textAlign: 'center', color: 'white' }}
        >
          Welcome to SWUDraftSim.com
        </Typography>
        <Typography
          variant='subtitle1'
          component='p'
          sx={{ textAlign: 'center', mt: '0rem', color: 'white' }}
        >
          Star Wars Unlimited draft simulator and sealed deckbuilder
        </Typography>
      </Box>
      <CardSets handleSetChange={handleSetChange} currentSet={currentSet} />
      {/* <Typography variant='h4' component='h2' sx={{ textAlign: 'center', mt: '2rem', color: 'white' }}>Draft</Typography> */}
      <DraftPack
        title={title}
        packNum={packNum}
        pickNum={pickNum}
        handleStartDraft={handleStartDraft}
        draftStarted={draftStarted}
        draftingLeaders={draftingLeaders}
        currentPack={currentPack}
        packIndex={packIndex}
        handlePopoverClose={handlePopoverClose}
        handlePopoverOpen={handlePopoverOpen}
        pickCard={pickCard}
        anchorEl={anchorEl}
        hoveredCard={hoveredCard}
        isLoading={isLoading}
        handleFlipLeader={handleFlipLeader}
        flippedLeaders={flippedLeaders}
        currentSet={currentSet}
      />
      <Deck
        deckLeaders={deckLeaders}
        setDeckLeaders={setDeckLeaders}
        deckCards={deckCards}
        setDeckCards={setDeckCards}
        setSideboardLeaders={setSideboardLeaders}
        setSideboardCards={setSideboardCards}
        draftStarted={draftStarted}
        sideboardCards={sideboardCards}
        base={base}
        setBase={setBase}
        baseColor={baseColor}
        setBaseColor={setBaseColor}
        currentSet={currentSet}
      />
      <Sideboard
        sideboardLeaders={sideboardLeaders}
        setSideboardLeaders={setSideboardLeaders}
        setSideboardCards={setSideboardCards}
        sideboardCards={sideboardCards}
        setDeckLeaders={setDeckLeaders}
        setDeckCards={setDeckCards}
        draftStarted={draftStarted}
      />
    </>
  );
}
