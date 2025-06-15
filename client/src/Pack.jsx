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

    let didRun = useRef(false);

    useEffect(() => {
        if (didRun.current) return;
        didRun.current = true;
        async function fetchCard() {
            const res = await fetch('http://localhost:3000/leader');
            const card = await res.json();
            setPack((prevPack) => [...prevPack, card]);
        }

        for (let i = 0; i < leaderNum; i++) {
            fetchCard();
        }
    })

    const pickCard = (id) => {
        const pickedCard = pack.find((card) => card.cardData?._id === id);
        if (!pickedCard) return;

        const pickedCardData = pickedCard.cardData;

        if (deckLeaders.length < 3) {
            setDeckLeaders((prev) => [...prev, pickedCardData]);
        } else {
            setDeckCards((prev) => [...prev, pickedCardData]);
        }

        setPack([]);

        if (leaderNum > 0) {
            didRun.current = false;
            setLeaderNum((prevLeaderNum) => prevLeaderNum - 1);
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
    };

    useEffect(() => {
        const fetchCards = async () => {
            async function fetchRareCard() {
                const res = await fetch('http://localhost:3000/rare');
                const card = await res.json();
                setPack((prevPack) => [...prevPack, card]);
            }

            async function fetchUncommonCards() {
                const res = await fetch('http://localhost:3000/uncommon');
                const card = await res.json();
                setPack((prevPack) => [...prevPack, card]);
            }

            async function fetchCommonCards() {
                const res = await fetch('http://localhost:3000/common');
                const card = await res.json();
                setPack((prevPack) => [...prevPack, card]);
            }

            if (leaderNum === 0) {
                for (let i = 0; i < rareNum; i++) {
                    await fetchRareCard();
                }

                for (let i = 0; i < uncommonNum; i++) {
                    await fetchUncommonCards();
                }

                for (let i = 0; i < commonNum; i++) {
                    await fetchCommonCards();
                }
            }
        };

        fetchCards();
    }, [leaderNum, rareNum, uncommonNum, commonNum]);

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
                <Typography variant='h3' component='h2' sx={{ mb: '1rem' }}>Pack 1</Typography>
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
