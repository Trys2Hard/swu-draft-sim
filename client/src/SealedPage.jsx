import { useState } from 'react';
import { Typography } from '@mui/material';
import Deck from './Deck';
import useCardHoverPopover from './useCardHoverPopover';
import Sets from './Sets';
import { v4 as uuid } from 'uuid';
import SealedPool from './SealedPool';

export default function SealedPage() {
    const [deckLeaders, setDeckLeaders] = useState([]);
    const [deckCards, setDeckCards] = useState([]);
    const [set, setSet] = useState('lof');
    const [setName, setSetName] = useState('Legends of the Force');
    const [sealedLeaderPool, setSealedLeaderPool] = useState([]);
    const [sealedStarted, setSealedStarted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [sealedCardPool, setSealedCardPool] = useState([]);

    const { anchorEl, hoveredCard, handlePopoverOpen, handlePopoverClose } = useCardHoverPopover('');

    let errorCount = 0;
    const sets = ['lof'];

    let uncommonIds = [];
    let commonIds = [];

    const fetchCard = async (rarity, seenIds = null) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/${rarity}?set=${set}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || `Failed to fetch ${rarity} card`);
            }

            if (seenIds && data.cardData?._id) {
                const isDuplicate = seenIds.includes(data.cardData._id);
                if (isDuplicate) {
                    return fetchCard(rarity, seenIds);
                } else {
                    seenIds.push(data.cardData._id);
                }
            }

            return data;
        } catch (error) {
            errorCount++;
            console.error(`Error fetching ${rarity} card`, error);
            if (rarity === 'rare') {
                alert('Rare card failed to load');
            }
        }
    };

    async function generateCards(count, rarity, seenIds = null) {
        const cards = [];
        for (let i = 0; i < count; i++) {
            const card = await fetchCard(rarity, seenIds);
            if (card) {
                cards.push({ cardObj: card, id: uuid() });
            }
        }
        if (errorCount > 0) {
            alert(`${errorCount} ${rarity} card${errorCount > 1 ? 's' : ''} failed to load.`);
        }
        return cards;
    }

    async function generateLeaderPool() {
        setIsLoading(true);
        const leaders = await generateCards(6, 'leader');
        setSealedLeaderPool((prev) => [...prev, leaders]);
    }

    async function generateCardPool() {
        setIsLoading(true);
        const rareCards = await generateCards(1, 'rare');
        const uncommonCards = await generateCards(3, 'uncommon', uncommonIds);
        const commonCards = await generateCards(10, 'common', commonIds);

        const cardPack = [...rareCards, ...uncommonCards, ...commonCards];

        if (cardPack.length === 14) {
            setSealedCardPool((prev) => [...prev, cardPack]);
        }
    }

    async function handleStartSealedBuild() {
        setSealedStarted(true);

        await generateLeaderPool();
        for (let i = 0; i < 6; i++) {
            await generateCardPool();
        }

        setIsLoading(false);

        if (errorCount > 0) {
            alert(`${errorCount} leader${errorCount > 1 ? 's' : ''}/card${errorCount > 1 ? 's' : ''} failed to load.`);
        }
    }

    function moveToDeck(id) {
        handlePopoverClose();

        let pickedCard = sealedLeaderPool.flat().find((card) => card.id === id) || sealedCardPool.flat().find((card) => card.id === id);
        if (!pickedCard) return;

        const isLeader = pickedCard.cardObj?.cardData?.Type === 'Leader';

        const stateToUpdate = isLeader ? sealedLeaderPool : sealedCardPool;
        const setStateToUpdate = isLeader ? setSealedLeaderPool : setSealedCardPool;

        const updatedSealedPool = stateToUpdate.flat().filter((card) => card.id !== id);
        setStateToUpdate(updatedSealedPool)

        const addCard = isLeader ? setDeckLeaders : setDeckCards;

        addCard((prev) => [...prev, pickedCard]);
    }

    function handleSetChange(e) {
        const newSet = e.target.value;
        setSet(newSet);
    }

    return (
        <>
            <Sets sets={sets} handleSetChange={handleSetChange} />
            <Typography variant='h3' component='h1' sx={{ textAlign: 'center', mt: '2rem', color: 'white' }}>Sealed</Typography>
            <SealedPool
                sealedStarted={sealedStarted}
                setName={setName}
                sealedLeaderPool={sealedLeaderPool}
                sealedCardPool={sealedCardPool}
                handleStartSealedBuild={handleStartSealedBuild}
                handlePopoverClose={handlePopoverClose}
                handlePopoverOpen={handlePopoverOpen}
                moveToDeck={moveToDeck}
                anchorEl={anchorEl}
                hoveredCard={hoveredCard}
                isLoading={isLoading} />
            <Deck
                deckLeaders={deckLeaders}
                setDeckLeaders={setDeckLeaders}
                deckCards={deckCards}
                setDeckCards={setDeckCards}
                setSealedLeaderPool={setSealedLeaderPool}
                setSealedCardPool={setSealedCardPool} />
        </>
    );
}
