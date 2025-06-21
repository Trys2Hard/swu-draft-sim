import { useState, useEffect, useRef } from 'react';
import { List, ListItem, Box, Typography, Button, Popover } from '@mui/material';
import Deck from './Deck';

export default function Pack() {
    const [leaderNum, setLeaderNum] = useState(-1);
    const [pack, setPack] = useState([]);
    const [deckLeaders, setDeckLeaders] = useState([]);
    const [deckCards, setDeckCards] = useState([]);
    const [rareNum, setRareNum] = useState(1);
    const [uncommonNum, setUncommonNum] = useState(3);
    const [commonNum, setCommonNum] = useState(10);
    const [pickNum, setPickNum] = useState(1);
    const [packNum, setPackNum] = useState(1);
    const [title, setTitle] = useState('Leaders');
    const [isFetching, setIsFetching] = useState(false);
    const [savedPacks, setSavedPacks] = useState([]);
    const [draftStarted, setDraftStarted] = useState(false);
    const [set, setSet] = useState('jtl');
    const [setName, setSetName] = useState('');

    useEffect(() => {
        if (set === 'jtl') {
            setSetName('Jump to Lightspeed');
        } else if (set === 'lof') {
            setSetName('Legends of the Force');
        }
    }, [set, setName])

    let errorCount = 0;

    useEffect(() => {
        const createLeaderPack = async () => {
            async function fetchLeaders() {
                try {
                    const res = await fetch(`http://localhost:3000/leader?set=${set}`);
                    const data = await res.json();

                    if (!res.ok) {
                        throw new Error(data.error || 'Failed to fetch leader');
                    }

                    setPack((prevPack) => [...prevPack, data]);
                } catch (error) {
                    errorCount++;
                    console.error('Error fetching leader', error);
                }
            }

            for (let i = 0; i < leaderNum; i++) {
                await fetchLeaders();
            }

            if (errorCount > 0) {
                alert(`${errorCount} leader${errorCount > 1 ? 's' : ''} failed to load.`);
            }
        }
        createLeaderPack();
    }, [leaderNum])

    const handleStartDraft = () => {
        setDraftStarted(true);
        setLeaderNum((prev) => prev + 4);
    }

    const handleSetChange = (e) => {
        const newSet = e.target.innerText.toLowerCase();
        setSet(newSet);
    }

    useEffect(() => {
        if (leaderNum === 0) {
            setPickNum(1);
            setTitle('Cards');
        }
    }, [leaderNum]);

    useEffect(() => {
        setSavedPacks([]);
    }, [packNum])

    useEffect(() => {
        const createCardPack = async () => {
            if (isFetching) return;
            setIsFetching(true);


            if (packNum === 4) {
                setTitle('Draft Complete');
                setPackNum(null);
                setPickNum(null);
            }

            async function fetchRareCard() {
                try {
                    const res = await fetch(`http://localhost:3000/rare?set=${set}`);
                    const data = await res.json();

                    if (!res.ok) {
                        throw new Error(data.error || 'Failed to fetch rare card');
                    }

                    setPack((prevPack) => [...prevPack, data]);
                } catch (error) {
                    console.error('Error fetching rare card', error);
                    alert('Rare card failed to load');
                }
            }

            let uncommonIds = [];
            async function fetchUncommonCard() {
                try {
                    const res = await fetch(`http://localhost:3000/uncommon?set=${set}`);
                    const data = await res.json();

                    if (!res.ok) {
                        throw new Error(data.error || 'Failed to fetch uncommon card');
                    }

                    const uncommonDuplicate = uncommonIds.some((id) => id === data.cardData._id);
                    uncommonIds.push(data.cardData._id);

                    if (uncommonDuplicate) {
                        return fetchUncommonCard()
                    } else {
                        setPack((prevPack) => [...prevPack, data]);
                    }
                } catch (error) {
                    errorCount++;
                    console.error('Error fetching uncommon cards', error);
                }
            }

            let commonIds = [];
            async function fetchCommonCard() {
                try {
                    const res = await fetch(`http://localhost:3000/common?set=${set}`);
                    const data = await res.json();

                    if (!res.ok) {
                        throw new Error(data.error || 'Failed to fetch common card');
                    }

                    const commonDuplicate = commonIds.some((id) => id === data.cardData._id);
                    commonIds.push(data.cardData._id);

                    if (commonDuplicate) {
                        return fetchCommonCard()
                    } else {
                        setPack((prevPack) => [...prevPack, data]);
                    }
                } catch (error) {
                    errorCount++;
                    console.error('Error fetching common cards', error);
                }
            }

            if (rareNum === 0 && uncommonNum === 0 && commonNum === 0) {
                setPackNum((prev) => prev + 1);
            }

            if (pickNum === 1) {
                setRareNum(1);
                setUncommonNum(3);
                setCommonNum(10);
            }

            if (pickNum > 8) {
                setIsFetching(false);
                const wheelPack = savedPacks.shift();
                return setPack(wheelPack);
            }

            if ((leaderNum === 0) && (packNum < 4 && packNum !== null)) {
                for (let i = 0; i < rareNum; i++) {
                    await fetchRareCard();
                }

                for (let i = 0; i < uncommonNum; i++) {
                    await fetchUncommonCard();
                }

                if (errorCount > 0) {
                    alert(`${errorCount} uncommon card${errorCount > 1 ? 's' : ''} failed to load.`);
                }

                for (let i = 0; i < commonNum; i++) {
                    await fetchCommonCard();
                }

                if (errorCount > 0) {
                    alert(`${errorCount} common card${errorCount > 1 ? 's' : ''} failed to load.`);
                }
            }
            setIsFetching(false);
        };

        createCardPack();
    }, [leaderNum, packNum, rareNum, uncommonNum, commonNum, setTitle, setPackNum, setPickNum, setPack, pickNum])

    const pickCard = (id) => {
        handlePopoverClose();

        if (isFetching || pack.length === 0) return;

        const pickedCard = pack.find((card) => card.cardData?._id === id);
        if (!pickedCard) return;

        const pickedCardData = pickedCard.cardData;

        const addCard = deckLeaders.length < 3 ? setDeckLeaders : setDeckCards;
        addCard((prev) => [...prev, pickedCardData]);

        if (leaderNum === 0) {
            const pickedCardIndex = pack.findIndex((item) => item.cardData._id === pickedCardData._id);
            pack.splice(pickedCardIndex, 1);
            setSavedPacks((prev) => [...prev, pack]);
        }

        setPack([]);

        if (leaderNum > 0) {
            setLeaderNum((prevLeaderNum) => prevLeaderNum - 1);
            setPickNum((prev) => prev + 1);
            return;
        }

        const availableRarities = [];
        if (rareNum > 0) availableRarities.push('rare');
        if (uncommonNum > 0) availableRarities.push('uncommon');
        if (commonNum > 0) availableRarities.push('common');

        if (availableRarities.length === 0) return;

        const rarity = availableRarities[Math.floor(Math.random() * availableRarities.length)];

        if (rarity === 'rare') {
            setRareNum((prev) => prev - 1);
        } else if (rarity === 'uncommon') {
            setUncommonNum((prev) => prev - 1);
        } else if (rarity === 'common') {
            setCommonNum((prev) => prev - 1);
        }

        savedPacks.map((pack) => {
            const randPackNum = Math.floor(Math.random() * pack.length);
            pack.splice(randPackNum, 1);
        })

        setPickNum(prev => (prev >= 14 ? 1 : prev + 1));
    };

    // Card Hover
    const [anchorEl, setAnchorEl] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);
    const hoverTimeoutRef = useRef(null);

    const handlePopoverOpen = (event, card) => {
        const target = event.currentTarget;
        if (!target) return;

        hoverTimeoutRef.current = setTimeout(() => {
            setAnchorEl(target);
            setHoveredCard(card);
        }, 400);
    };

    const handlePopoverClose = () => {
        clearTimeout(hoverTimeoutRef.current);
        setAnchorEl(null);
        setHoveredCard(null);
    };

    const open = Boolean(anchorEl);

    // Styles
    const styles = {
        packBox: {
            width: '50%',
            height: '100%',
            m: '8rem auto 8rem auto',
            p: '1rem',
            backgroundColor: 'rgba(55, 55, 55, 1)',
            borderRadius: '5px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'white',
        },
        pack: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
        },
        card: {
            width: '15%',
            p: '0rem',
            '&: hover': {
                cursor: 'pointer',
                outline: '3px solid rgb(61, 178, 255)',
                borderRadius: '10px',
            },
            transition: 'transform 0.3s ease-in-out',
        },
        cardImage: {
            width: '100%',
            borderRadius: '10px',
        },
        startDraft: {
            display: draftStarted ? 'none' : 'block',
        },
        frontArtPopover: {
            width: '20rem',
            height: 'auto',
            aspectRatio: hoveredCard?.Type === 'Leader' ? '7/5' : hoveredCard?.Type === 'Base' ? '7/5' : '5/7',
            borderRadius: '15px',
            ml: '6px',
        },
        backArtPopover: {
            width: '20rem',
            height: 'auto',
            aspectRatio: '5/7',
            borderRadius: '15px',
            ml: '3px',
        },
    };

    return (
        <>
            <Typography variant='h2' component='h1' sx={{ textAlign: 'center', mt: '2rem', color: 'white' }} >Star Wars Unlimited Draft Simulator</Typography>
            <Box sx={styles.packBox}>
                <Button variant='contained' onClick={handleSetChange}>jtl</Button>
                <Button variant='contained' onClick={handleSetChange}>lof</Button>
                <Typography variant='h2' component='h2' sx={{ mb: '1rem' }}>{title}</Typography>
                <Typography variant='h3' component='h3' sx={{ mb: '1rem' }}>Pack: {packNum}</Typography>
                <Typography variant='h3' component='h3' sx={{ mb: '1rem' }}>Pick: {pickNum}</Typography>
                <Typography variant='h2' component='h4'>{setName}</Typography>
                <Button variant='contained' sx={styles.startDraft} onClick={() => handleStartDraft()}>Start Draft</Button>
                <List sx={styles.pack}>
                    {pack.map((card) => {
                        const labelId = `card-id-${card.cardData._id}`;
                        return (
                            <>
                                <ListItem
                                    aria-owns={open ? 'mouse-over-popover' : undefined}
                                    aria-haspopup="true"
                                    onMouseEnter={(e) => handlePopoverOpen(e, card.cardData)}
                                    onMouseLeave={handlePopoverClose} key={card.cardData._id} onClick={() => pickCard(card.cardData._id)} sx={styles.card}>
                                    <Box component='img' src={card.cardData.FrontArt} id={labelId} sx={styles.cardImage}></Box>
                                </ListItem>
                            </>
                        );
                    })}
                    <Popover
                        id="mouse-over-popover"
                        sx={{
                            pointerEvents: 'none',
                            '& .MuiPaper-root': {
                                backgroundColor: 'transparent',
                                boxShadow: 'none',
                            }
                        }}
                        open={open}
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'center',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'center',
                            horizontal: 'left',
                        }}
                        onClose={handlePopoverClose}
                        disableRestoreFocus
                        disableScrollLock
                    >
                        {hoveredCard && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box
                                    component='img'
                                    src={hoveredCard?.FrontArt}
                                    sx={styles.frontArtPopover}>
                                </Box>
                                {hoveredCard?.DoubleSided &&
                                    <Box
                                        component='img'
                                        src={hoveredCard?.BackArt}
                                        sx={styles.backArtPopover}>
                                    </Box>}
                            </Box>
                        )}
                    </Popover>
                </List>
            </Box>
            <Deck deckLeaders={deckLeaders} deckCards={deckCards} />
        </>
    );
};
