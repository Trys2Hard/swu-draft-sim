import { useState, useEffect, useRef } from 'react';
import { Typography, Box } from '@mui/material';
import { v4 as uuid } from 'uuid';
import { useCardHoverPopover } from '../Hooks/useCardHoverPopover';
import { useCreatePacks } from '../Hooks/useCreatePacks';
import CardSets from '../Components/CardSets';
import DraftPack from '../DraftPage/DraftPack';
import Deck from '../Components/Deck/Deck';
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
  const [draftPhase, setDraftPhase] = useState('leaders');

  // Use ref to immediately hide packs during transition (prevents flash unless leaders are picked quickly)
  const isTransitioningRef = useRef(false);

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

  const currentPack = isTransitioningRef.current
    ? []
    : draftPhase === 'loading-cards'
      ? []
      : draftPhase === 'cards'
        ? cardPacks
        : leaderPacks;

  const draftingLeaders = draftPhase === 'leaders' && leaderPacks.length > 0;

  let errorCount = 0;

  useEffect(() => {
    // Transition from loading to cards when packs are ready
    if (cardPacks.length === 8 && draftPhase === 'loading-cards') {
      isTransitioningRef.current = false;
      setDraftPhase('cards');
      setIsLoading(false);
    } else if (cardPacks.length === 8 && draftPhase === 'cards') {
      setIsLoading(false);
    }
  }, [cardPacks, draftPhase, setIsLoading]);

  useEffect(() => {
    if (leaderPacks.length === 8) {
      setIsLoading(false);
    }
  }, [leaderPacks, setIsLoading]);

  async function handleStartDraft() {
    setDraftStarted(true);
    setIsLoading(true);

    const packPromises = [];
    for (let i = 0; i < 8; i++) {
      packPromises.push(generateLeaderPack(3));
    }

    await Promise.all(packPromises);

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

    const isInLeaderPhase = draftPhase === 'leaders';
    const isInCardPhase = draftPhase === 'cards';
    const packs = isInLeaderPhase ? leaderPacks : cardPacks;
    const setPacks = isInLeaderPhase ? setLeaderPacks : setCardPacks;
    const addCard = isInLeaderPhase ? setDeckLeaders : setDeckCards;

    let pickedCard = packs[packIndex]?.find((card) => card.id === id);
    if (!pickedCard) return;

    if (packs.length === 8) {
      // Handle duplicate IDs
      const dupId = deckCards.some((c) => c.id === pickedCard.id);
      if (dupId) {
        pickedCard = { ...pickedCard, id: uuid() };
      }

      // Create new packs array with card removed
      const newPacks = packs.map((pack, index) => {
        if (index === packIndex) {
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
          return pack.filter((card) => card.id !== cardPick?.id);
        }
      });

      // Check if this is the last leader pick BEFORE any state updates
      const isLastLeaderPick =
        draftStarted &&
        isInLeaderPhase &&
        newPacks.every((arr) => arr.length === 0);

      if (isLastLeaderPick) {
        // Set ref FIRST - this immediately hides packs on next render
        isTransitioningRef.current = true;

        // Now update state - even if batched, currentPack will be empty due to ref
        addCard((prev) => [...prev, pickedCard]);
        setDraftPhase('loading-cards');
        setIsLoading(true);
        setTitle('Cards');
        setPackNum(1);
        setPickNum(1);
        setPackIndex(0);
        resetCardPacks();
        resetSeenIds();

        // Generate all card packs in parallel
        const packPromises = [];
        for (let i = 0; i < 8; i++) {
          packPromises.push(generateCardPack());
        }

        // When done, ref will be cleared in useEffect
        Promise.all(packPromises).catch((error) => {
          console.error('Error generating card packs:', error);
          isTransitioningRef.current = false;
          setIsLoading(false);
          setDraftPhase('cards');
        });

        return;
      }

      // Normal pick flow
      addCard((prev) => [...prev, pickedCard]);
      setPacks(newPacks);
      setPackIndex((prev) => (prev === 7 ? 0 : prev + 1));
      setPickNum((prev) => prev + 1);

      // Check if card pack is complete
      if (
        draftStarted &&
        isInCardPhase &&
        newPacks.every((arr) => arr.length === 0) &&
        packNum < 3
      ) {
        // Use ref to prevent flash between card packs too
        isTransitioningRef.current = true;

        setPackNum((prev) => prev + 1);
        setPickNum(1);
        setPackIndex(0);
        resetCardPacks();
        resetSeenIds();
        setIsLoading(true);
        setDraftPhase('loading-cards');

        // Generate all packs in parallel
        const packPromises = [];
        for (let i = 0; i < 8; i++) {
          packPromises.push(generateCardPack());
        }

        Promise.all(packPromises).catch((error) => {
          console.error('Error generating card packs:', error);
          isTransitioningRef.current = false;
          setIsLoading(false);
          setDraftPhase('cards');
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
        currentSet={currentSet}
      />
    </>
  );
}
