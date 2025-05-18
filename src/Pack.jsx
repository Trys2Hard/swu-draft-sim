import { useState } from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import Deck from './Deck';

const initialPack = [
    { id: 0, name: 'Han Solo' },
    { id: 1, name: 'Luke Skywalker' },
    { id: 2, name: 'Ahoska Tano' },
];

export default function Pack() {
    const [pack, setPack] = useState(initialPack);
    const [deck, setDeck] = useState([]);

    const pickCard = (id) => {
        const pickedCard = pack.find((p) => p.id === id);
        setDeck((prevDeck) => [...prevDeck, pickedCard]);
        setPack((prevPack) => prevPack.filter((p) => p.id !== id));
    };

    return (
        <>
            <List sx={{ width: '50rem', height: '10rem', m: '8rem auto 8rem auto', display: 'flex', outline: '2px solid red' }}>
                {pack.map((card) => {
                    const labelId = `card-id-${card.id}`;
                    return (
                        <>
                            <ListItem deck={deck} key={card.id} onClick={() => pickCard(card.id)} sx={{ border: '2px solid blue', m: '1rem' }}>
                                <ListItemText id={labelId} primary={card.name} />
                            </ListItem>
                        </>
                    );
                })}
            </List>
            <Deck deck={deck} />
        </>
    );
};
