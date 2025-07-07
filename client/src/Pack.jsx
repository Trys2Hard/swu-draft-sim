import { useState, useEffect } from 'react';
import { List, ListItem, Box, Typography, Button, Popover } from '@mui/material';
import Deck from './Deck';
import CardHover from './CardHover';
import useCardHoverPopover from './useCardHoverPopover';
import Sets from './Sets';
import { v4 as uuid } from 'uuid';

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

    const getLeader = async () => {
        try {
            const res = await fetch(`http://localhost:3000/leader?set=${set}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to fetch leader');
            }
            return data;
        } catch (error) {
            errorCount++;
            console.error('Error fetching leader', error);
        }
    }

    const getRareCard = async () => {
        try {
            const res = await fetch(`http://localhost:3000/rare?set=${set}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to fetch rare card');
            }

            return data;
        } catch (error) {
            console.error('Error fetching rare card', error);
            alert('Rare card failed to load');
        }
    }

    let uncommonIds = [];
    const getUncommonCard = async () => {
        try {
            const res = await fetch(`http://localhost:3000/uncommon?set=${set}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to fetch uncommon card');
            }

            const uncommonDuplicate = uncommonIds.some((id) => id === data.cardData._id);
            uncommonIds.push(data.cardData._id);

            if (uncommonDuplicate) {
                return getUncommonCard()
            } else {
                return data;
            }
        } catch (error) {
            errorCount++;
            console.error('Error fetching uncommon cards', error);
        }
    }

    let commonIds = [];
    const getCommonCard = async () => {
        try {
            const res = await fetch(`http://localhost:3000/common?set=${set}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to fetch common card');
            }

            const commonDuplicate = commonIds.some((id) => id === data.cardData._id);
            commonIds.push(data.cardData._id);

            if (commonDuplicate) {
                return getCommonCard()
            } else {
                return data;
            }
        } catch (error) {
            errorCount++;
            console.error('Error fetching common cards', error);
        }
    }

    async function generateLeaderPack() {
        let leaderPack = [];
        for (let i = 0; i < 3; i++) {
            const leader = await getLeader();
            if (leader) {
                const leaderObj = { cardObj: leader, id: uuid() };
                leaderPack.push(leaderObj);
            }
        }
        if (leaderPack.length === 3) {
            setLeaderPacks((prev) => [...prev, leaderPack]);
        }
    }

    async function generateCardPack() {
        let cardPack = [];
        for (let i = 0; i < 1; i++) {
            const rareCard = await getRareCard();
            if (rareCard) {
                const rareCardObj = { cardObj: rareCard, id: uuid() };
                cardPack.push(rareCardObj);
            }
        }

        if (errorCount > 0) {
            alert(`${errorCount} rare card${errorCount > 1 ? 's' : ''} failed to load.`);
        }

        for (let i = 0; i < 3; i++) {
            const uncommonCard = await getUncommonCard();
            if (uncommonCard) {
                const uncommonCardObj = { cardObj: uncommonCard, id: uuid() };
                cardPack.push(uncommonCardObj);
            }
        }

        if (errorCount > 0) {
            alert(`${errorCount} uncommon card${errorCount > 1 ? 's' : ''} failed to load.`);
        }

        for (let i = 0; i < 10; i++) {
            const commonCard = await getCommonCard();
            if (commonCard) {
                const commonCardObj = { cardObj: commonCard, id: uuid() };
                cardPack.push(commonCardObj);
            }
        }

        if (errorCount > 0) {
            alert(`${errorCount} common card${errorCount > 1 ? 's' : ''} failed to load.`);
        }

        if (cardPack.length === 14) {
            setCardPacks((prev) => [...prev, cardPack]);
        }
    }

    async function handleStartDraft() {
        setDraftStarted(true);

        for (let i = 0; i < 8; i++) {
            await generateLeaderPack();
        }

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

        const pickedCard = currentPack[packIndex]?.find((card) => card.id === id);
        if (!pickedCard) return;

        let addCard = setDeckLeaders;
        let packs = leaderPacks;

        if (leadersDrafted) {
            addCard = setDeckCards;
            packs = cardPacks;
        }

        if (packs.length === 8) {
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
            } else if (draftEnded) {
                setTitle('Draft Complete');
            }
        }
    };

    //Styles
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
            gap: draftingLeaders ? '1rem' : '0.5rem',
            backdropFilter: draftStarted && 'brightness(0.7)',
            borderRadius: '5px',
            p: draftStarted && '1rem',
            justifyContent: 'center',
        },
        card: {
            width: draftingLeaders ? '20%' : '15%',
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
        startDraft: {
            display: draftStarted ? 'none' : 'flex',
            backgroundColor: 'rgba(73, 73, 73, 1)',
            borderRadius: '6px',
            '&:hover': {
                filter: 'brightness(1.2)',
            },
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
                <Button variant='contained' sx={styles.startDraft} onClick={() => handleStartDraft()}>Start Draft</Button>
                {draftStarted && <List sx={styles.pack}>
                    {currentPack[packIndex]?.map((card) => {
                        const cardId = `card-id-${card.id}`;
                        return (
                            <ListItem
                                aria-owns={open ? 'mouse-over-popover' : undefined}
                                aria-haspopup="true"
                                onMouseEnter={(e) => handlePopoverOpen(e, card)}
                                onMouseLeave={handlePopoverClose}
                                key={cardId}
                                onClick={() => pickCard(card.id)}
                                sx={styles.card}>
                                <Box component='img' src={card.cardObj?.cardData?.FrontArt} id={cardId} sx={styles.cardImage}></Box>
                            </ListItem>
                        );
                    })}
                    <CardHover
                        anchorEl={anchorEl}
                        hoveredCard={hoveredCard}
                        onHoverClose={handlePopoverClose} />
                </List>}
            </Box>
            <Deck deckLeaders={deckLeaders} deckCards={deckCards} />
        </>
    );
};
