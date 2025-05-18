import { Box } from '@mui/material';

const styles = {
    deck: {
        border: '2px dashed blue',
        width: '80%',
        height: '15rem',
        m: '0 auto 0 auto',
    },
    card: {
        border: '1px dashed green',
    }
}

export default function Deck({ deck }) {
    return (
        <Box sx={styles.deck}>
            {deck.map((card) => {
                return <Box key={card.id} sx={styles.card}>{card.name}</Box>
            })}
        </Box>
    );
};
