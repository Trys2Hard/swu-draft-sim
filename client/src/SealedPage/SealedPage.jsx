import { useState, useEffect } from 'react';
import Deck from '../Components/Deck/Deck';
import { useCardHoverPopover } from '../Hooks/useCardHoverPopover';
import { useCreatePacks } from '../Hooks/useCreatePacks';
import CardSets from '../Components/CardSets';
import SealedPool from '../SealedPage/Components/SealedPool';
import { v4 as uuid } from 'uuid';
import LZString from 'lz-string';

export default function SealedPage() {
  const [deckLeaders, setDeckLeaders] = useState([]);
  const [deckCards, setDeckCards] = useState([]);
  const [sealedStarted, setSealedStarted] = useState(false);
  const [base, setBase] = useState('');
  const [sealedImportStarted, setSealedImportStarted] = useState(false);
  const [baseColor, setBaseColor] = useState('var(--off-white)');

  const { anchorEl, hoveredCard, handlePopoverOpen, handlePopoverClose } =
    useCardHoverPopover('');
  const {
    currentSet,
    setCurrentSet,
    generateLeaderPack,
    generateCardPack,
    leaderPacks,
    cardPacks,
    setLeaderPacks,
    setCardPacks,
    isLoading,
    setIsLoading,
  } = useCreatePacks();

  let errorCount = 0;

  // Aspect color mapping
  const aspectColorMap = new Map([
    ['Vigilance', 'rgba(45, 136, 255, 1)'],
    ['Cunning', 'rgba(231, 228, 46, 1)'],
    ['Aggression', 'rgba(233, 36, 36, 1)'],
    ['Command', 'rgba(40, 224, 40, 1)'],
  ]);

  useEffect(() => {
    if (cardPacks.length === 6) {
      setIsLoading(false);
    }
  }, [cardPacks, setIsLoading]);

  async function handleStartSealedBuild() {
    setSealedStarted(true);

    await generateLeaderPack(6, { sealedPool: true });
    for (let i = 0; i < 6; i++) {
      await generateCardPack();
    }

    if (errorCount > 0) {
      alert(
        `${errorCount} leader${errorCount > 1 ? 's' : ''}/card${errorCount > 1 ? 's' : ''} failed to load.`
      );
    }
  }

  const fetchCardById = async (cardId) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/card/${cardId}`
    );
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || `Failed to fetch ${cardId}`);

    return data.cardData;
  };

  const fetchBaseData = async (baseId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/card/${baseId}`
      );
      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || `Failed to fetch base ${baseId}`);

      return data.cardData;
    } catch (err) {
      console.error('Failed to fetch base data:', err);
      return null;
    }
  };

  async function handleImportSealedPool() {
    setSealedImportStarted(true);
    const text = await navigator.clipboard.readText();

    try {
      let json;

      // Detect deck link vs raw JSON
      if (text.startsWith('http')) {
        const url = new URL(text);
        const deckParam = url.searchParams.get('deck');

        if (!deckParam) {
          throw new Error('No deck parameter found in URL');
        }

        const decompressed =
          LZString.decompressFromEncodedURIComponent(deckParam);

        if (!decompressed) {
          throw new Error('Failed to decompress deck data');
        }

        json = JSON.parse(decompressed);
      } else {
        json = JSON.parse(text);
      }

      // Import base and update color
      if (json.base) {
        // Ensure base is a string (handle both "SET_NUM" format and object format)
        const baseId =
          typeof json.base === 'string'
            ? json.base
            : json.base.id || `${json.base.Set}_${json.base.Number}`;

        setBase(baseId);

        // Fetch base data to get its aspect and set the color
        const baseData = await fetchBaseData(baseId);
        if (baseData && baseData.Aspects && baseData.Aspects.length > 0) {
          const aspectColor = aspectColorMap.get(baseData.Aspects[0]);
          if (aspectColor) {
            setBaseColor(aspectColor);
          }
        }
      }

      setDeckLeaders([]);
      setDeckCards([]);

      // Pool non-leader cards (`deck` in link JSON)
      const poolCardEntries = json.deck || [];
      const poolIds = poolCardEntries.flatMap((card) => {
        const ids = [];
        for (let i = 0; i < card.count; i++) {
          ids.push(card.id);
        }
        return ids;
      });

      const poolCardsData = await Promise.all(poolIds.map((id) => fetchCardById(id)));

      const idCards = poolCardsData.map((card) => ({
        id: uuid(),
        cardData: { ...card },
      }));

      setCardPacks(idCards);

      // Handle leaders correctly
      let leaderIds = [];

      // Check if leader is an array (sealed pools) or object (constructed decks)
      if (Array.isArray(json.leader)) {
        // Sealed pool format: array of leader objects
        leaderIds = json.leader.flatMap((leader) => {
          const ids = [];
          for (let i = 0; i < leader.count; i++) {
            ids.push(leader.id);
          }
          return ids;
        });
      } else if (json.leader?.id) {
        // Constructed deck format: single leader object
        for (let i = 0; i < (json.leader.count || 1); i++) {
          leaderIds.push(json.leader.id);
        }
      }

      if (leaderIds.length > 0) {
        const leaders = await Promise.all(
          leaderIds.map((id) => fetchCardById(id))
        );

        const idLeaders = leaders.map((leader) => ({
          id: uuid(),
          cardData: { ...leader },
        }));

        setLeaderPacks(idLeaders);
      }

      const builtLeaderEntries = json.builtDeckLeaders || [];
      const builtDeckEntries = json.builtDeckCards || [];
      if (builtLeaderEntries.length > 0 || builtDeckEntries.length > 0) {
        const builtLeaderIds = builtLeaderEntries.flatMap((entry) => {
          const ids = [];
          for (let i = 0; i < entry.count; i++) {
            ids.push(entry.id);
          }
          return ids;
        });
        const builtCardIds = builtDeckEntries.flatMap((entry) => {
          const ids = [];
          for (let i = 0; i < entry.count; i++) {
            ids.push(entry.id);
          }
          return ids;
        });

        const [builtLeadersData, builtCardsData] = await Promise.all([
          Promise.all(builtLeaderIds.map((id) => fetchCardById(id))),
          Promise.all(builtCardIds.map((id) => fetchCardById(id))),
        ]);

        setDeckLeaders(
          builtLeadersData.map((card) => ({
            id: uuid(),
            cardData: { ...card },
          })),
        );
        setDeckCards(
          builtCardsData.map((card) => ({
            id: uuid(),
            cardData: { ...card },
          })),
        );
      }
    } catch (err) {
      console.error('Import failed:', err);
      alert(`Import failed: ${err.message}`);
      setSealedImportStarted(false);
    }
  }

  function moveToDeck(id) {
    if (!isLoading) {
      handlePopoverClose();

      let pickedCard =
        leaderPacks.flat().find((card) => card.id === id) ||
        cardPacks.flat().find((card) => card.id === id);
      if (!pickedCard) return;

      const isLeader = pickedCard.cardData?.Type === 'Leader';

      const stateToUpdate = isLeader ? leaderPacks : cardPacks;
      const setStateToUpdate = isLeader ? setLeaderPacks : setCardPacks;

      const updatedSealedPool = stateToUpdate
        .flat()
        .filter((card) => card.id !== id);
      setStateToUpdate(updatedSealedPool);

      const addCard = isLeader ? setDeckLeaders : setDeckCards;

      addCard((prev) => [...prev, pickedCard]);
    }
  }

  function handleSetChange(newSet) {
    setCurrentSet(newSet);
  }

  return (
    <>
      <CardSets handleSetChange={handleSetChange} currentSet={currentSet} />
      <SealedPool
        sealedStarted={sealedStarted}
        handleStartSealedBuild={handleStartSealedBuild}
        handlePopoverClose={handlePopoverClose}
        handlePopoverOpen={handlePopoverOpen}
        moveToDeck={moveToDeck}
        anchorEl={anchorEl}
        hoveredCard={hoveredCard}
        leaderPacks={leaderPacks}
        cardPacks={cardPacks}
        setCardPacks={setCardPacks}
        currentSet={currentSet}
        isLoading={isLoading}
        base={base}
        setBase={setBase}
        handleImportSealedPool={handleImportSealedPool}
        sealedImportStarted={sealedImportStarted}
        baseColor={baseColor}
        setBaseColor={setBaseColor}
        deckLeaders={deckLeaders}
        deckCards={deckCards}
      />
      <Deck
        sealedStarted={sealedStarted}
        deckLeaders={deckLeaders}
        setDeckLeaders={setDeckLeaders}
        deckCards={deckCards}
        setDeckCards={setDeckCards}
        setLeaderPacks={setLeaderPacks}
        cardPacks={cardPacks}
        setCardPacks={setCardPacks}
        base={base}
        setBase={setBase}
        currentSet={currentSet}
        sealedImportStarted={sealedImportStarted}
        baseColor={baseColor}
        setBaseColor={setBaseColor}
      />
    </>
  );
}
