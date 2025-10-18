import { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import Deck from './Deck';
import useCardHoverPopover from './useCardHoverPopover';
import useCreatePacks from './useCreatePacks';
import CardSets from './CardSets';
import { v4 as uuid } from 'uuid';
import DraftPack from './DraftPack';
import Sideboard from './Sideboard';

export default function DraftPage() {
    const [deckLeaders, setDeckLeaders] = useState([]);
    const [deckCards, setDeckCards] = useState([]);
    const [pickNum, setPickNum] = useState(1);
    const [packNum, setPackNum] = useState(0);
    const [title, setTitle] = useState('Leaders');
    const [cardSet, setCardSet] = useState('lof');
    const [packIndex, setPackIndex] = useState(0);
    const [draftStarted, setDraftStarted] = useState(false);
    const [sideboardLeaders, setSideboardLeaders] = useState([]);
    const [sideboardCards, setSideboardCards] = useState([]);
    const [flippedLeaders, setFlippedLeaders] = useState({});

    const { anchorEl, hoveredCard, handlePopoverOpen, handlePopoverClose } = useCardHoverPopover('');
    const { generateLeaderPack, generateCardPack, leaderPacks, cardPacks, isLoading, resetCardPacks, resetSeenIds, setIsLoading } = useCreatePacks('');

    const leadersDrafted = draftStarted && leaderPacks.every(arr => arr.length === 0);
    const currentPack = leadersDrafted ? cardPacks : leaderPacks;
    const draftingLeaders = draftStarted && leaderPacks.every(arr => arr.length > 0);
    const draftEnded = packNum === 3 && pickNum === 14;

    let errorCount = 0;

    useEffect(() => {
        if (cardPacks.length === 8) {
            setIsLoading(false);
        }
    }, [cardPacks, setIsLoading])

    useEffect(() => {
        if (leaderPacks.length === 8) {
            setIsLoading(false);
        }
    }, [leaderPacks, setIsLoading])

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
        setCardSet(newSet);
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

        let addCard = setDeckLeaders;
        let packs = leaderPacks;

        if (leadersDrafted) {
            addCard = setDeckCards;
            packs = cardPacks;
        }

        if (packs.length === 8) {
            const dupId = deckCards.some((c) => c.id === pickedCard.id);
            if (dupId) {
                pickedCard = { ...pickedCard, id: uuid() };
            }
            addCard((prev) => [...prev, pickedCard]);

            setPackIndex((prev) => prev + 1);

            const pickedCardIndex = packs[packIndex]?.findIndex((item) => item.id === pickedCard.cardObj?.id);
            packs[packIndex].splice(pickedCardIndex, 1);

            packs.map((pack) => {
                if (packs.indexOf(pack) !== packIndex) {
                    const cardPick = pack.reduce((highest, card) => {
                        if (!highest || (card.cardObj?.cardData?.Rank ?? 0) > (highest.cardObj?.cardData?.Rank ?? 0)) {
                            return card;
                        }
                        return highest;
                    }, null);
                    const botPickedCardIndex = pack.indexOf(cardPick);
                    pack.splice(botPickedCardIndex, 1);
                }
            })

            if (packIndex === 7) {
                setPackIndex(0);
            }

            if (draftStarted && leaderPacks.every(arr => arr.length === 0 && pickNum < 15)) {
                setTitle('Cards');
            }

            setPickNum((prev) => prev + 1);

            if (draftStarted && packs.every(arr => arr.length === 0) && packNum < 3) {
                setPackNum((prev) => prev + 1);
                setPickNum(1);
                setPackIndex(0);
                resetCardPacks();
                for (let i = 0; i < 8; i++) {
                    generateCardPack();
                    resetSeenIds();
                }
            } else if (draftEnded) {
                setTitle('Draft Complete');
            }
        }
    }

    return (
        <>
            <Box>
                <Typography variant='h4' component='h1' sx={{ textAlign: 'center', mt: '1rem', color: 'white' }}>Welcome to SWUDraftSim.com</Typography>
                <Typography variant='subtitle1' component='p' sx={{ textAlign: 'center', mt: '0rem', color: 'white' }}>Star Wars Unlimited draft simulator and sealed deckbuilder</Typography>
            </Box>
            <CardSets handleSetChange={handleSetChange} />
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
                cardSet={cardSet} />
            <Deck
                deckLeaders={deckLeaders}
                setDeckLeaders={setDeckLeaders}
                deckCards={deckCards}
                setDeckCards={setDeckCards}
                setSideboardLeaders={setSideboardLeaders}
                setSideboardCards={setSideboardCards}
                draftStarted={draftStarted} />
            <Sideboard
                sideboardLeaders={sideboardLeaders}
                setSideboardLeaders={setSideboardLeaders}
                setSideboardCards={setSideboardCards}
                sideboardCards={sideboardCards}
                setDeckLeaders={setDeckLeaders}
                setDeckCards={setDeckCards}
                draftStarted={draftStarted} />
        </>
    );
}
