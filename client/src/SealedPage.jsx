import { useState } from 'react';
import Deck from './Deck';
import useCardHoverPopover from './useCardHoverPopover';
import useCreatePacks from './useCreatePacks';
import CardSets from './CardSets';
import SealedPool from './SealedPool';

export default function SealedPage() {
    const [deckLeaders, setDeckLeaders] = useState([]);
    const [deckCards, setDeckCards] = useState([]);
    const [sealedStarted, setSealedStarted] = useState(false);

    const { anchorEl, hoveredCard, handlePopoverOpen, handlePopoverClose } = useCardHoverPopover('');
    const { currentSet, setCurrentSet, generateLeaderPack, generateCardPack, leaderPacks, cardPacks, setLeaderPacks, setCardPacks } = useCreatePacks('');

    let errorCount = 0;

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


    function handleSetChange(newSet) {
        setCurrentSet(newSet);
    }

    return (
        <>
            {/* <Typography variant='h3' component='h1' sx={{ textAlign: 'center', mt: '0.5rem', color: 'white' }}>Sealed</Typography> */}
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
                currentSet={currentSet} />
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
