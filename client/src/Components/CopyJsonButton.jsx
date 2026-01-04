import { Box, Button } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useCopyJson } from '../Hooks/useCopyJson';

export default function CopyJsonButton({ deckLeaders, sortedDeckCards, sideboardCards, leaderPacks, sortedCardPacks, base, children, onSnackbar }) {
    const { handleCopyJson } = useCopyJson({
        deckLeaders,
        sortedDeckCards,
        sideboardCards,
        leaderPacks,
        sortedCardPacks,
        base,
    });

    const handleClick = () => {
        const result = handleCopyJson();

        if (onSnackbar && result) {
            onSnackbar(result.text, result.status);
        }
    };

    //Styles
    const styles = {
        copyJsonButton: {
            ...(sortedCardPacks && {
                width: '100%',
                background: 'none',
                boxShadow: 'none',
                '&:hover': {
                    boxShadow: 'none',
                },
                display: 'flex',
                justifyContent: 'flex-start',
            }),

            ...(sortedDeckCards && {
                fontSize: '0.8rem',
                backgroundColor: 'rgba(65, 65, 65, 1)',
                borderRadius: '5px',
                mt: '0.5rem',
                p: '0.4rem 0.6rem',
                '&:hover': {
                    filter: 'brightness(1.2)',
                },
            }),
        },
    };

    return (
        <Box>
            <Button
                variant='contained'
                sx={styles.copyJsonButton}
                onClick={handleClick}
                startIcon={<ContentCopyIcon />}
            >
                {children}
            </Button>
        </Box>
    );
}
