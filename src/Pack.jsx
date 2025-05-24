import { v4 as uuid } from 'uuid';
import { useState, useEffect, useRef } from 'react';
import { List, ListItem, Box } from '@mui/material';
import Deck from './Deck';

export default function Pack() {
    const [leaderNum, setLeaderNum] = useState(3);
    const [cardNum, setCardNum] = useState(14);
    const [pack, setPack] = useState([]);
    const [deckLeaders, setDeckLeaders] = useState([]);
    const [deckCards, setDeckCards] = useState([]);

    let didRun = useRef(false);

    useEffect(() => {
        if (didRun.current) return;
        didRun.current = true;
        for (let i = 0; i < leaderNum; i++) {
            async function getCardData() {
                const randNum = Math.floor(Math.random() * 18) + 1;
                const response = await fetch(`https://api.swu-db.com/cards/jtl/${randNum}`);
                const data = await response.json();
                const card = { ...data, id: uuid() }
                setPack((prevPack) => [...prevPack, card])
            }
            getCardData();
        }
    }, [leaderNum]);

    useEffect(() => {
        async function getNonLeaders() {
            const randNum = Math.floor(Math.random() * 231) + 32;
            const response = await fetch(`https://api.swu-db.com/cards/jtl/${randNum}`);
            const data = await response.json();
            const card = { ...data, id: uuid() }
            setPack((prevPack) => [...prevPack, card])
        }
        if (cardNum > 0 && leaderNum === 0) {
            for (let i = 0; i < cardNum; i++) {
                getNonLeaders();
            }
        }
    }, [leaderNum, cardNum])

    const pickCard = (id) => {
        const pickedCard = pack.find((card) => card.id === id);
        const pickedCardImage = pickedCard.FrontArt;

        if (deckLeaders.length < 3) {
            setDeckLeaders((prevDeckLeaders) => [...prevDeckLeaders, pickedCardImage]);
        } else {
            setDeckCards((prevDeckCards => [...prevDeckCards, pickedCardImage]))
        }

        pack.length = 0;

        if (leaderNum > 0) {
            didRun.current = false;
            setLeaderNum((prevLeaderNum) => prevLeaderNum - 1);
        } else if (cardNum > 0) {
            didRun.current = false;
            setCardNum((prevCardNum) => prevCardNum - 1);
        };
    };

    return (
        <>
            <List sx={{ width: '80%', height: '100%', m: '8rem auto 8rem auto', display: 'flex', flexWrap: 'wrap', outline: '2px solid red' }}>
                {pack.map((card) => {
                    const labelId = `card-id-${card.id}`;
                    return (
                        <>
                            <ListItem key={card.id} onClick={() => pickCard(card.id)} sx={{ border: '2px solid blue', width: '25%', height: '9rem' }}>
                                <Box component='img' src={card.FrontArt} id={labelId} sx={{ width: '200px', p: '1rem' }}></Box>
                            </ListItem>
                        </>
                    );
                })}
            </List>
            <Deck deckLeaders={deckLeaders} deckCards={deckCards} />
        </>
    );
};
