import { useState } from 'react';
import { Box, Typography, List, ListItem } from '@mui/material';
import Deck from './Deck';
import useCardHoverPopover from './useCardHoverPopover';
import Sets from './Sets';
import { v4 as uuid } from 'uuid';
import DefaultButton from './DefaultButton';
import CardHover from './CardHover';

export default function SealedPage() {
    const [deckLeaders, setDeckLeaders] = useState([]);
    const [deckCards, setDeckCards] = useState([]);
    const [title, setTitle] = useState('Leaders');
    const [sealedBuildLoaded, setSealedBuildLoaded] = useState(false);
    const [set, setSet] = useState('lof');
    const [setName, setSetName] = useState('Legends of the Force');
    const [sealedLeaderPool, setSealedLeaderPool] = useState([]);
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
        await generateLeaderPool();
        for (let i = 0; i < 6; i++) {
            await generateCardPool();
        }

        setSealedBuildLoaded(true);

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
        pack: {
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            backdropFilter: sealedBuildLoaded && 'brightness(0.7)',
            borderRadius: '5px',
            p: sealedBuildLoaded && '1rem',
            justifyContent: 'center',
            filter: isLoading ? 'blur(2px)' : 'blur(0)',
        },
        packLeaders: {
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            backdropFilter: sealedBuildLoaded && 'brightness(0.7)',
            borderRadius: '5px',
            p: sealedBuildLoaded && '1rem',
            justifyContent: 'center',
            filter: isLoading ? 'blur(2px)' : 'blur(0)',
        },
        card: {
            width: '15%',
            p: '0rem',
            transition: 'transform 0.3s ease-in-out',
        },
        cardLeaders: {
            width: '20%',
            p: '0rem',
            transition: 'transform 0.3s ease-in-out',
        },
        cardImage: {
            width: '100%',
            borderRadius: '10px',
            '&: hover': {
                cursor: 'pointer',
                outline: '3px solid rgb(61, 178, 255)',
            },
        },
        loading: {
            display: isLoading ? 'block' : 'none',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textShadow: '2px 2px 3px black',
        },
    };

    return (
        <>
            <Typography variant='h3' component='h1' sx={{ textAlign: 'center', mt: '1rem', color: 'white' }}>Sealed</Typography>
            <Sets sets={sets} handleSetChange={handleSetChange} />
            <Box sx={styles.packBox}>
                {!sealedBuildLoaded &&
                    <Box>
                        <Typography variant='h2' component='h4' sx={{ mb: '1rem' }}>{setName}</Typography>
                        <DefaultButton onClick={() => handleStartSealedBuild()}>Start Sealed Build</DefaultButton>
                    </Box>
                }
                {sealedBuildLoaded &&
                    <Box sx={{ width: '100%' }}>
                        <Typography variant='h3' component='h2' sx={{ mb: '1rem', display: 'flex', justifyContent: 'center' }}>Leaders</Typography>
                    </Box>}
                {sealedBuildLoaded &&
                    <List sx={styles.packLeaders}>
                        {sealedLeaderPool.flat().map((card) => {
                            const cardId = `card-id-${card.id}`;
                            return (
                                <ListItem
                                    aria-owns={open ? 'mouse-over-popover' : undefined}
                                    aria-haspopup="true"
                                    onMouseEnter={(e) => handlePopoverOpen(e, card)}
                                    onMouseLeave={handlePopoverClose}
                                    key={cardId}
                                    onClick={() => moveToDeck(card.id)}
                                    sx={styles.cardLeaders}>
                                    <Box component='img' src={card.cardObj?.cardData?.FrontArt} id={cardId} sx={styles.cardImage} />
                                </ListItem>
                            )
                        })}
                    </List>
                }
                {sealedBuildLoaded &&
                    <Box sx={{ width: '100%' }}>
                        <Typography variant='h3' component='h2' sx={{ mb: '1rem', display: 'flex', justifyContent: 'center' }}>Cards</Typography>
                    </Box>}
                {sealedBuildLoaded &&
                    <List sx={styles.pack}>
                        {sealedCardPool.flat().map((card) => {
                            const cardId = `card-id-${card.id}`;
                            return (
                                <ListItem
                                    aria-owns={open ? 'mouse-over-popover' : undefined}
                                    aria-haspopup="true"
                                    onMouseEnter={(e) => handlePopoverOpen(e, card)}
                                    onMouseLeave={handlePopoverClose}
                                    key={cardId}
                                    onClick={() => moveToDeck(card.id)}
                                    sx={styles.card}>
                                    <Box component='img' src={card.cardObj?.cardData?.FrontArt} id={cardId} sx={styles.cardImage} />
                                </ListItem>
                            )
                        })}
                    </List>}
                <CardHover
                    anchorEl={anchorEl}
                    hoveredCard={hoveredCard}
                    onHoverClose={handlePopoverClose} />
            </Box>
            <Deck
                deckLeaders={deckLeaders}
                setDeckLeaders={setDeckLeaders}
                deckCards={deckCards}
                setDeckCards={setDeckCards}
                setSealedLeaderPool={setSealedLeaderPool}
                setSealedCardPool={setSealedCardPool} />
        </>
    );
};

