import { useState, useEffect } from 'react';
import Deck from './Deck';
import useCardHoverPopover from './useCardHoverPopover';
import useCreatePacks from './useCreatePacks';
import CardSets from './CardSets';
import SealedPool from './SealedPool';
import { v4 as uuid } from 'uuid';

export default function SealedPage() {
    const [deckLeaders, setDeckLeaders] = useState([]);
    const [deckCards, setDeckCards] = useState([]);
    const [sealedStarted, setSealedStarted] = useState(false);
    const [base, setBase] = useState('');
    const [sealedImportStarted, setSealedImportStarted] = useState(false);

    const { anchorEl, hoveredCard, handlePopoverOpen, handlePopoverClose } = useCardHoverPopover('');
    const { currentSet, setCurrentSet, generateLeaderPack, generateCardPack, leaderPacks, cardPacks, setLeaderPacks, setCardPacks, isLoading, setIsLoading } = useCreatePacks();

    let errorCount = 0;

    useEffect(() => {
        if (cardPacks.length === 6) {
            setIsLoading(false);
        }
    }, [cardPacks, setIsLoading])

    async function handleStartSealedBuild() {
        setSealedStarted(true);

        await generateLeaderPack(6);
        for (let i = 0; i < 6; i++) {
            await generateCardPack();
        }

        if (errorCount > 0) {
            alert(`${errorCount} leader${errorCount > 1 ? 's' : ''}/card${errorCount > 1 ? 's' : ''} failed to load.`);
        }
    }

    const fetchCardById = async (cardId) => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/card/${cardId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || `Failed to fetch ${cardId}`);

        return data.cardData;
    };


    async function handleImportSealedPool() {
        setSealedImportStarted(true);
        const text = await navigator.clipboard.readText();

        try {
            //Cards
            const json = JSON.parse(text);
            const ids = json.deck.map(card => card.id);
            const cards = await Promise.all(ids.map(id => fetchCardById(id)));

            const idCards = cards.map(card => ({
                id: uuid(),
                cardData: { ...card },
            }));

            setCardPacks(idCards);

            //Leaders
            // const leaderId = json.leader.id;
            // const leader = await fetchCardById(leaderId);

            // const idLeader = {
            //     id: uuid(),
            //     cardData: { ...leader },
            // };

            // setLeaderPacks(idLeader);
        } catch (err) {
            console.error("Clipboard did not contain valid JSON:", err);
        }
    }

    function moveToDeck(id) {
        handlePopoverClose();

        let pickedCard = leaderPacks.flat().find((card) => card.id === id) || cardPacks.flat().find((card) => card.id === id);
        if (!pickedCard) return;

        const isLeader = pickedCard.cardData?.Type === 'Leader';

        const stateToUpdate = isLeader ? leaderPacks : cardPacks;
        const setStateToUpdate = isLeader ? setLeaderPacks : setCardPacks;

        const updatedSealedPool = stateToUpdate.flat().filter((card) => card.id !== id);
        setStateToUpdate(updatedSealedPool)

        const addCard = isLeader ? setDeckLeaders : setDeckCards;

        addCard((prev) => [...prev, pickedCard]);
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
            />
            <Deck
                sealedStarted={sealedStarted}
                deckLeaders={deckLeaders}
                setDeckLeaders={setDeckLeaders}
                deckCards={deckCards}
                setDeckCards={setDeckCards}
                setLeaderPacks={setLeaderPacks}
                setCardPacks={setCardPacks}
                base={base}
                setBase={setBase}
                currentSet={currentSet}
                sealedImportStarted={sealedImportStarted} />
        </>
    );
}
