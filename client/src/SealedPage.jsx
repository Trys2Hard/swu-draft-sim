import { useState } from 'react';
import { Typography } from '@mui/material';
import Deck from './Deck';
import useCardHoverPopover from './useCardHoverPopover';
import useCreatePacks from './useCreatePacks';
import Sets from './Sets';
import SealedPool from './SealedPool';

export default function SealedPage() {
    const [deckLeaders, setDeckLeaders] = useState([]);
    const [deckCards, setDeckCards] = useState([]);
    const [cardSet, setCardSet] = useState('lof');
    const [setName, setSetName] = useState('Legends of the Force');
    const [sealedStarted, setSealedStarted] = useState(false);

    const { anchorEl, hoveredCard, handlePopoverOpen, handlePopoverClose } = useCardHoverPopover('');
    const { generateLeaderPack, generateCardPack, leaderPacks, cardPacks, setLeaderPacks, setCardPacks } = useCreatePacks('');

    let errorCount = 0;
    const sets = ['lof'];

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

    function moveToDeck(id) {
        handlePopoverClose();

        let pickedCard = leaderPacks.flat().find((card) => card.id === id) || cardPacks.flat().find((card) => card.id === id);
        if (!pickedCard) return;

        const isLeader = pickedCard.cardObj?.cardData?.Type === 'Leader';

        const stateToUpdate = isLeader ? leaderPacks : cardPacks;
        const setStateToUpdate = isLeader ? setLeaderPacks : setCardPacks;

        const updatedSealedPool = stateToUpdate.flat().filter((card) => card.id !== id);
        setStateToUpdate(updatedSealedPool)

        const addCard = isLeader ? setDeckLeaders : setDeckCards;

        addCard((prev) => [...prev, pickedCard]);
    }

    function handleSetChange(e) {
        const newSet = e.target.value;
        setCardSet(newSet);
    }

    return (
        <>
            {/* <Typography variant='h3' component='h1' sx={{ textAlign: 'center', mt: '0.5rem', color: 'white' }}>Sealed</Typography> */}
            <Sets handleSetChange={handleSetChange} />
            <SealedPool
                sealedStarted={sealedStarted}
                setName={setName}
                handleStartSealedBuild={handleStartSealedBuild}
                handlePopoverClose={handlePopoverClose}
                handlePopoverOpen={handlePopoverOpen}
                moveToDeck={moveToDeck}
                anchorEl={anchorEl}
                hoveredCard={hoveredCard}
                leaderPacks={leaderPacks}
                cardPacks={cardPacks}
                cardSet={cardSet} />
            <Deck
                sealedStarted={sealedStarted}
                deckLeaders={deckLeaders}
                setDeckLeaders={setDeckLeaders}
                deckCards={deckCards}
                setDeckCards={setDeckCards}
                setLeaderPacks={setLeaderPacks}
                setCardPacks={setCardPacks} />
        </>
    );
}
