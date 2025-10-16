import { Button } from '@mui/material';

export default function LeaderFlipButton({ id, handleFlipLeader }) {
    //Styles
    const styles = {
        flipButton: {
            mt: '0.5rem',
            p: '0.3rem',
            backgroundColor: 'rgba(65, 65, 65, 1)',
            borderRadius: '5px',
            '&:hover': {
                filter: 'brightness(1.1)',
            },
        },
    }

    return (
        <Button variant='contained' sx={styles.flipButton} onClick={() => handleFlipLeader(id)}>Flip</Button>
    );
}
