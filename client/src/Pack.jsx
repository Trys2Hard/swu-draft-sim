import { useState, useEffect, useRef } from 'react';
import { List, ListItem, Box, Typography } from '@mui/material';
import Deck from './Deck';

export default function Pack() {
    const [leaderNum, setLeaderNum] = useState(3);
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

    let didRun = useRef(false);
    let didRunCreateCards = useRef(false);

    useEffect(() => {
        if (didRun.current) return;
        didRun.current = true;
        const createLeaderPack = async () => {
            async function fetchLeaders() {
                const res = await fetch('http://localhost:3000/leader');
                const card = await res.json();
                setPack((prevPack) => [...prevPack, card]);
            }

            for (let i = 0; i < leaderNum; i++) {
                fetchLeaders();
            }
        }
        createLeaderPack();
    }, [leaderNum])

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
        if (didRunCreateCards.current || leaderNum !== 0) return;
        didRunCreateCards.current = true;

        const createCardPack = async () => {
            if (isFetching) return;
            setIsFetching(true);


            if (packNum === 4) {
                setTitle('Draft Complete');
                setPackNum(null);
                setPickNum(null);
            }

            async function fetchRareCard() {
                const res = await fetch('http://localhost:3000/rare');
                const card = await res.json();
                setPack((prevPack) => [...prevPack, card]);
            }

            let uncommonIds = [];
            async function fetchUncommonCard() {
                const res = await fetch('http://localhost:3000/uncommon');
                const card = await res.json();
                const uncommonDuplicate = uncommonIds.some((id) => id === card.cardData._id);
                uncommonIds.push(card.cardData._id);
                if (uncommonDuplicate) {
                    return fetchUncommonCard()
                } else {
                    setPack((prevPack) => [...prevPack, card]);
                }
            }

            let commonIds = [];
            async function fetchCommonCard() {
                const res = await fetch('http://localhost:3000/common');
                const card = await res.json();
                const commonDuplicate = commonIds.some((id) => id === card.cardData._id);
                commonIds.push(card.cardData._id);
                if (commonDuplicate) {
                    return fetchCommonCard()
                } else {
                    setPack((prevPack) => [...prevPack, card]);
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
                didRunCreateCards.current = false;
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

                for (let i = 0; i < commonNum; i++) {
                    await fetchCommonCard();
                }
            }
            didRunCreateCards.current = false;
            setIsFetching(false);
        };

        createCardPack();
    }, [leaderNum, packNum, rareNum, uncommonNum, commonNum, setTitle, setPackNum, setPickNum, setPack, pickNum])

    const pickCard = (id) => {
        if (isFetching || pack.length === 0) return;

        const pickedCard = pack.find((card) => card.cardData?._id === id);
        if (!pickedCard) return;

        const pickedCardData = pickedCard.cardData;

        const addCard = deckLeaders.length < 3 ? setDeckLeaders : setDeckCards;
        addCard((prev) => [...prev, pickedCardData]);

        if (leaderNum === 0) {
            const randPackNum = Math.floor(Math.random() * pack.length);
            pack.splice(randPackNum, 1);
            setSavedPacks((prev) => [...prev, pack]);
        }

        setPack([]);

        if (leaderNum > 0) {
            didRun.current = false;
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
                transform: 'translate(0, -10px)',
            },
            transition: 'transform 0.3s ease-in-out',
        },
        cardImage: {
            width: '100%',
            borderRadius: '10px',
        },
    };

    return (
        <>
            <Typography variant='h2' component='h1' sx={{ textAlign: 'center', mt: '2rem', color: 'white' }} >Star Wars Unlimited Draft Simulator</Typography>
            <Box sx={styles.packBox}>
                <Typography variant='h2' component='h2' sx={{ mb: '1rem' }}>{title}</Typography>
                <Typography variant='h3' component='h3' sx={{ mb: '1rem' }}>Pack: {packNum}</Typography>
                <Typography variant='h3' component='h3' sx={{ mb: '1rem' }}>Pick: {pickNum}</Typography>
                <List sx={styles.pack}>
                    {pack.map((card) => {
                        const labelId = `card-id-${card.cardData._id}`;
                        return (
                            <>
                                <ListItem key={card.cardData._id} onClick={() => pickCard(card.cardData._id)} sx={styles.card}>
                                    <Box component='img' src={card.cardData.FrontArt} id={labelId} sx={styles.cardImage}></Box>
                                </ListItem>
                            </>
                        );
                    })}
                </List>
            </Box>
            <Deck deckLeaders={deckLeaders} deckCards={deckCards} />
        </>
    );
};
