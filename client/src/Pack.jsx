import { useState, useEffect } from 'react';
import { List, ListItem, Box, Typography, Button, Popover } from '@mui/material';
import Deck from './Deck';
import CardHover from './CardHover';
import useCardHoverPopover from './useCardHoverPopover';

export default function Pack() {
    const [leaderNum, setLeaderNum] = useState(3);
    const [cardPackNum, setCardPackNum] = useState(14);
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
    const [set, setSet] = useState('lof');
    const [setName, setSetName] = useState('');
    const [leaderPacks, setLeaderPacks] = useState([]);
    const [cardPacks, setCardPacks] = useState([]);
    const [num, setNum] = useState(0);

    const { anchorEl, hoveredCard, handlePopoverOpen, handlePopoverClose } = useCardHoverPopover('');

    const leadersDrafted = draftStarted && leaderPacks.every(arr => arr.length === 0);
    const currentPack = leadersDrafted ? cardPacks : leaderPacks;

    let errorCount = 0;
    const sets = ['lof', 'jtl', 'twi', 'shd', 'sor'];

    useEffect(() => {
        if (set === 'lof') {
            setSetName('Legends of the Force');
        } else if (set === 'jtl') {
            setSetName('Jump to Lightspeed');
        } else if (set === 'twi') {
            setSetName('Twilight of the Republic');
        } else if (set === 'shd') {
            setSetName('Shadows of the Galaxy');
        } else if (set === 'sor') {
            setSetName('Spark of Rebellion');
        }
    }, [set, setName])

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
                leaderPack.push(leader);
            }
        }
        if (leaderPack.length === 3) {
            setLeaderPacks((prev) => [...prev, leaderPack]);
        }
    }

    async function generateCardPack() {
        let cardPack = [];
        for (let i = 0; i < rareNum; i++) {
            const rareCard = await getRareCard();
            if (rareCard) {
                cardPack.push(rareCard);
            }
        }

        if (errorCount > 0) {
            alert(`${errorCount} rare card${errorCount > 1 ? 's' : ''} failed to load.`);
        }

        for (let i = 0; i < uncommonNum; i++) {
            const uncommonCard = await getUncommonCard();
            if (uncommonCard) {
                cardPack.push(uncommonCard);
            }
        }

        if (errorCount > 0) {
            alert(`${errorCount} uncommon card${errorCount > 1 ? 's' : ''} failed to load.`);
        }

        for (let i = 0; i < commonNum; i++) {
            const commonCard = await getCommonCard();
            if (commonCard) {
                cardPack.push(commonCard);
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



        // for (let i = 0; i < 8; i++) {
        //     await generateCardPack();
        // }













        // setLeaderNum((prev) => prev + 4);



        // if ((leaderNum === 0) && (packNum < 4 && packNum !== null)) {
        //     for (let i = 0; i < rareNum; i++) {
        //         await fetchRareCard();
        //     }

        //     if (errorCount > 0) {
        //         alert(`${errorCount} rare card${errorCount > 1 ? 's' : ''} failed to load.`);
        //     }

        //     for (let i = 0; i < uncommonNum; i++) {
        //         await fetchUncommonCard();
        //     }

        //     if (errorCount > 0) {
        //         alert(`${errorCount} uncommon card${errorCount > 1 ? 's' : ''} failed to load.`);
        //     }

        //     for (let i = 0; i < commonNum; i++) {
        //         await fetchCommonCard();
        //     }

        //     if (errorCount > 0) {
        //         alert(`${errorCount} common card${errorCount > 1 ? 's' : ''} failed to load.`);
        //     }
        // }
    }

    // useEffect(() => {
    //     setNum((prev) => prev + 1);
    //     // console.log(num)
    //     // console.log('Leader Packs', leaderPacks)
    // }, [leaderNum])

    // useEffect(() => {
    //     setNum((prev) => prev + 1);
    //     // console.log(num)
    //     // console.log('Leader Packs', leaderPacks)
    // }, [cardPackNum])

    // useEffect(() => {

    // }, [num])

    function handleSetChange(e) {
        const newSet = e.target.value;
        setSet(newSet);
    }

    useEffect(() => {
        if (draftStarted && leaderPacks.every(arr => arr.length === 0)) {
            setTitle('Cards');
        }
    }, [num]);

    useEffect(() => {
        setSavedPacks([]);
    }, [packNum])




    // useEffect(() => {
    //     const createCardPack = async () => {
    //         if (isFetching) return;
    //         setIsFetching(true);


    //         if (packNum === 4) {
    //             setTitle('Draft Complete');
    //             setPackNum(null);
    //             setPickNum(null);
    //         }

    //         if (rareNum === 0 && uncommonNum === 0 && commonNum === 0) {
    //             setPackNum((prev) => prev + 1);
    //         }

    //         if (pickNum === 1) {
    //             setRareNum(1);
    //             setUncommonNum(3);
    //             setCommonNum(10);
    //         }

    //         if (pickNum > 8) {
    //             setIsFetching(false);
    //             const wheelPack = savedPacks.shift();
    //             return setPack(wheelPack);
    //         }
    //         setIsFetching(false);
    //     };

    //     createCardPack();
    // }, [leaderNum, packNum, rareNum, uncommonNum, commonNum, setTitle, setPackNum, setPickNum, setPack, pickNum])

    async function pickCard(id) {
        handlePopoverClose();

        if (isFetching || currentPack[num].length === 0) return;

        const pickedCard = currentPack[num].find((card) => card.cardData?._id === id);
        if (!pickedCard) return;

        const pickedCardData = pickedCard.cardData;

        let addCard = setDeckLeaders;
        let packs = leaderPacks;

        if (leadersDrafted) {
            addCard = setDeckCards;
            packs = cardPacks;
        }

        if (packs.length === 8) {
            addCard((prev) => [...prev, pickedCardData]);

            setNum((prev) => prev + 1);

            const pickedCardIndex = packs[num].findIndex((item) => item.cardData._id === pickedCardData._id);
            packs[num].splice(pickedCardIndex, 1);

            packs.map((pack) => {
                if (packs.indexOf(pack) !== num) {
                    const randNum = Math.floor(Math.random() * pack.length);
                    pack.splice(randNum, 1);
                }
            })

            if (num === 7) {
                setNum(0);
            }
        }

        if (draftStarted && packs.every(arr => arr.length === 0)) {
            setNum(0);
            setCardPacks([]);
            for (let i = 0; i < 8; i++) {
                await generateCardPack();
                commonIds = [];
                uncommonIds = [];
            }
        }

        console.log('leader packs', leaderPacks);
        console.log('card packs', cardPacks)
        console.log('num', num)



        // if (leaderPacks.every(arr => arr.length === 0)) {
        //     console.log('all leaders drafted')
        // }


        // if (leaderNum === 0) {
        //     const pickedCardIndex = pack.findIndex((item) => item.cardData._id === pickedCardData._id);
        //     pack.splice(pickedCardIndex, 1);
        //     setSavedPacks((prev) => [...prev, pack]);
        // }

        // setPack([]);

        // if (leaderNum > 0) {
        //     setLeaderNum((prevLeaderNum) => prevLeaderNum - 1);
        //     setPickNum((prev) => prev + 1);
        //     return;
        // }

        // const availableRarities = [];
        // if (rareNum > 0) availableRarities.push('rare');
        // if (uncommonNum > 0) availableRarities.push('uncommon');
        // if (commonNum > 0) availableRarities.push('common');

        // if (availableRarities.length === 0) return;

        // const rarity = availableRarities[Math.floor(Math.random() * availableRarities.length)];

        // if (rarity === 'rare') {
        //     setRareNum((prev) => prev - 1);
        // } else if (rarity === 'uncommon') {
        //     setUncommonNum((prev) => prev - 1);
        // } else if (rarity === 'common') {
        //     setCommonNum((prev) => prev - 1);
        // }

        // savedPacks.map((pack) => {
        //     const randPackNum = Math.floor(Math.random() * pack.length);
        //     pack.splice(randPackNum, 1);
        // })

        // setPickNum(prev => (prev >= 14 ? 1 : prev + 1));
    };

    // useEffect(() => {
    //     if (draftStarted && cardPacks.every(arr => arr.length === 0)) {
    //         console.log('pack is done');
    //     }
    // }, [cardPacks])

    //Styles
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
    };

    // cardPacks[0]?.map((card) => console.log(card.cardData?._id));

    return (
        <>
            <Typography variant='h2' component='h1' sx={{ textAlign: 'center', mt: '2rem', color: 'white' }} >Star Wars Unlimited Draft Simulator</Typography>
            <Box sx={styles.packBox}>
                <List sx={{ display: 'flex' }}>
                    {sets.map((set) => {
                        return (
                            <ListItem>
                                <Button variant='contained' value={set} onClick={handleSetChange}>{set}</Button>
                            </ListItem>
                        )
                    })}
                </List>
                <Typography variant='h2' component='h2' sx={{ mb: '1rem' }}>{title}</Typography>
                <Typography variant='h3' component='h3' sx={{ mb: '1rem' }}>Pack: {packNum}</Typography>
                <Typography variant='h3' component='h3' sx={{ mb: '1rem' }}>Pick: {pickNum}</Typography>
                <Typography variant='h2' component='h4'>{setName}</Typography>
                <Button variant='contained' sx={styles.startDraft} onClick={() => handleStartDraft()}>Start Draft</Button>
                <List sx={styles.pack}>
                    {currentPack[num]?.map((card) => {
                        const labelId = `card-id-${card.cardData?._id}`;
                        return (
                            <>
                                <ListItem
                                    aria-owns={open ? 'mouse-over-popover' : undefined}
                                    aria-haspopup="true"
                                    onMouseEnter={(e) => handlePopoverOpen(e, card.cardData)}
                                    onMouseLeave={handlePopoverClose} key={card.cardData?._id} onClick={() => pickCard(card.cardData?._id)} sx={styles.card}>
                                    <Box component='img' src={card.cardData?.FrontArt} id={labelId} sx={styles.cardImage}></Box>
                                </ListItem>
                            </>
                        );
                    })}
                    {/* {leadersDrafted && <Button>Click me</Button>} */}
                    <CardHover
                        anchorEl={anchorEl}
                        hoveredCard={hoveredCard}
                        onHoverClose={handlePopoverClose} />
                </List>
            </Box>
            <Deck deckLeaders={deckLeaders} deckCards={deckCards} />
        </>
    );
};
