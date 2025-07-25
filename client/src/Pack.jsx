import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import Deck from './Deck';
import useCardHoverPopover from './useCardHoverPopover';
import Sets from './Sets';
import { v4 as uuid } from 'uuid';
import CurrentPack from './CurrentPack';
import DefaultButton from './DefaultButton';

export default function Pack() {
    const [deckLeaders, setDeckLeaders] = useState([]);
    const [deckCards, setDeckCards] = useState([]);
    const [pickNum, setPickNum] = useState(1);
    const [packNum, setPackNum] = useState(null);
    const [title, setTitle] = useState('Leaders');
    const [draftStarted, setDraftStarted] = useState(false);
    const [set, setSet] = useState('lof');
    const [setName, setSetName] = useState('Legends of the Force');
    const [leaderPacks, setLeaderPacks] = useState([]);
    const [cardPacks, setCardPacks] = useState([]);
    const [packIndex, setPackIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const { anchorEl, hoveredCard, handlePopoverOpen, handlePopoverClose } = useCardHoverPopover('');

    const leadersDrafted = draftStarted && leaderPacks.every(arr => arr.length === 0);
    const currentPack = leadersDrafted ? cardPacks : leaderPacks;
    const draftingLeaders = draftStarted && leaderPacks.every(arr => arr.length > 0);
    const draftEnded = packNum === 3 && pickNum === 14;

    let errorCount = 0;
    // const sets = ['lof', 'jtl', 'twi', 'shd', 'sor'];
    const sets = ['lof'];

    // useEffect(() => {
    //     if (set === 'lof') {
    //         setSetName('Legends of the Force');
    //     } else if (set === 'jtl') {
    //         setSetName('Jump to Lightspeed');
    //     } else if (set === 'twi') {
    //         setSetName('Twilight of the Republic');
    //     } else if (set === 'shd') {
    //         setSetName('Shadows of the Galaxy');
    //     } else if (set === 'sor') {
    //         setSetName('Spark of Rebellion');
    //     }
    // }, [set, setName])

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

    async function generateLeaderPack() {
        setIsLoading(true);
        const leaderPack = await generateCards(3, 'leader');
        if (leaderPack.length === 3) {
            setLeaderPacks((prev) => [...prev, leaderPack]);
        }
    }

    async function generateCardPack() {
        setIsLoading(true);
        const rareCards = await generateCards(1, 'rare');
        const uncommonCards = await generateCards(3, 'uncommon', uncommonIds);
        const commonCards = await generateCards(10, 'common', commonIds);

        const cardPack = [...rareCards, ...uncommonCards, ...commonCards];

        if (cardPack.length === 14) {
            setCardPacks((prev) => [...prev, cardPack]);
        }
    }

    async function handleStartDraft() {
        setDraftStarted(true);

        for (let i = 0; i < 8; i++) {
            await generateLeaderPack();
        }

        setIsLoading(false);

        if (errorCount > 0) {
            alert(`${errorCount} leader${errorCount > 1 ? 's' : ''} failed to load.`);
        }
    }

    function handleSetChange(e) {
        const newSet = e.target.value;
        setSet(newSet);
    }

    async function pickCard(id) {
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
                setCardPacks([]);
                for (let i = 0; i < 8; i++) {
                    await generateCardPack();
                    commonIds = [];
                    uncommonIds = [];
                }
                setIsLoading(false);
            } else if (draftEnded) {
                setTitle('Draft Complete');
            }
        }
    };

    const styles = {
        packBox: {
            width: '60%',
            height: '100%',
            m: '5rem auto 5rem auto',
            p: '0.5rem',
            backgroundColor: 'rgba(31, 202, 255, 0.5)',
            borderRadius: '5px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'white',
        },
    };

    return (
        <>
            <Sets sets={sets} handleSetChange={handleSetChange} />
            <Box sx={styles.packBox}>
                {draftStarted &&
                    <Box sx={{ width: '100%' }}>
                        <Typography variant='h3' component='h2' sx={{ mb: '1rem', display: 'flex', justifyContent: 'center' }}>{title}</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                            <Typography variant='h4' component='h3' sx={{ mb: '1rem', mr: '1rem' }}>Pack: {packNum}</Typography>
                            <Typography variant='h4' component='h3' sx={{ mb: '1rem', ml: '1rem' }}>Pick: {pickNum}</Typography>
                        </Box>
                    </Box>}
                {!draftStarted && <Typography variant='h2' component='h4' sx={{ mb: '1rem' }}>{setName}</Typography>}
                <DefaultButton draftStarted={draftStarted} handleStartDraft={handleStartDraft}>Start Draft</DefaultButton>
                {draftStarted && < CurrentPack
                    draftStarted={draftStarted}
                    draftingLeaders={draftingLeaders}
                    currentPack={currentPack}
                    packIndex={packIndex}
                    handlePopoverClose={handlePopoverClose}
                    handlePopoverOpen={handlePopoverOpen}
                    pickCard={pickCard}
                    anchorEl={anchorEl}
                    hoveredCard={hoveredCard}
                    isLoading={isLoading} />}
            </Box>
            <Deck deckLeaders={deckLeaders} deckCards={deckCards} />
        </>
    );
};
