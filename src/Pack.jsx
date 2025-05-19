import { useState, useEffect } from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import Deck from './Deck';

const leaders = [
    { id: 0, name: 'Han Solo' },
    { id: 1, name: 'Luke Skywalker' },
    { id: 2, name: 'Ahoska Tano' },
    { id: 3, name: 'Obi-wan Kenobi' },
    { id: 4, name: 'Anakin Skywalker' },
    { id: 5, name: 'Kit Fisto' },
];

const cards = [
    { id: 0, name: 'Direct Hit' },
    { id: 1, name: 'Vanquish' },
    { id: 2, name: 'Dogfight' },
    { id: 3, name: 'For A Cause I Believe In' },
    { id: 4, name: 'Takedown' },
    { id: 5, name: 'Surprise Strike' },
    { id: 6, name: 'Direct Hit' },
    { id: 7, name: 'Vanquish' },
    { id: 8, name: 'Dogfight' },
    { id: 9, name: 'For A Cause I Believe In' },
    { id: 10, name: 'Takedown' },
    { id: 11, name: 'Surprise Strike' },
    { id: 12, name: 'Direct Hit' },
    { id: 13, name: 'Vanquish' },
];

function shuffle(array) {
    let currentIndex = array.length;
    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    };
    return array;
};

export default function Pack() {
    const [leaderNum, setLeaderNum] = useState(3);
    const [cardNum, setCardNum] = useState(14);
    const [pack, setPack] = useState([]);
    const [deckLeaders, setDeck] = useState([]);
    const [deckCards, setDeckCards] = useState([]);

    useEffect(() => {
        if (leaderNum > 0) {
            const shuffledLeaders = shuffle([...leaders]);
            const leaderPack = shuffledLeaders.slice(0, leaderNum);
            setPack(leaderPack);
        } else {
            const shuffledCards = shuffle([...cards]);
            const cardPack = shuffledCards.slice(0, cardNum);
            setPack(cardPack);
        }
    }, [leaderNum, cardNum]);

    const pickCard = (id) => {
        const pickedCard = pack.find((p) => p.id === id);
        if (deckLeaders.length < 3) {
            setDeck((prevDeck) => [...prevDeck, pickedCard]);
        } else {
            setDeckCards((prevDeckCards => [...prevDeckCards, pickedCard]))
        }
        setPack((prevPack) => prevPack.filter((p) => p.id !== id));
        if (leaderNum > 0) {
            setLeaderNum((prevLeaderNum) => prevLeaderNum - 1);
        } else {
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
                            <ListItem key={card.id} onClick={() => pickCard(card.id)} sx={{ border: '2px solid blue', m: '1rem', width: '7rem', height: '9rem' }}>
                                <ListItemText id={labelId} primary={card.name} />
                            </ListItem>
                        </>
                    );
                })}
            </List>
            <Deck deckLeaders={deckLeaders} deckCards={deckCards} />
        </>
    );
};
