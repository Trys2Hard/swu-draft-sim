import { useState } from 'react';
import { Box, Button, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

export default function CopyJsonButton({ deckLeaders, sortedDeckCards, sideboardCards, leaderPacks, sortedCardPacks, base }) {
    const [open, setOpen] = useState(false);
    const [snackbarText, setSnackbarText] = useState('JSON Copied to Clipboard!');
    const [snackbarStatus, setSnackbarStatus] = useState('success');

    const snackbarColor = snackbarStatus === 'success' ? 'rgba(75, 247, 113, 0.8)' : snackbarStatus === 'warning' ? 'rgba(236, 242, 76, 0.8)' : 'none';

    const handleCopyJson = () => {
        setOpen(true);

        const deckCountMap = new Map();
        for (const card of sortedDeckCards || sortedCardPacks) {
            const set = card?.cardData?.Set;
            let num = card?.cardData?.Number;

            if (!set || !num) continue;

            if (num >= 537 && num <= 774) {
                num = (num - 510).toString();
            } else if (num >= 767 && num <= 1004) {
                num = (num - 740).toString();
            }
            if (num.length === 2) {
                num = '0' + num;
            } else if (num.length === 1) {
                num = '00' + num;
            }

            const id = `${set}_${num}`;
            deckCountMap.set(id, (deckCountMap.get(id) || 0) + 1);
        }
        const combinedDeck = Array.from(deckCountMap, ([id, count]) => ({ id, count }));

        const sideboardCountMap = new Map();
        if (sideboardCards) {
            for (const card of sideboardCards) {
                const set = card?.cardData?.Set;
                const num = card?.cardData?.Number;
                if (!set || !num) continue;
                const id = `${set}_${num}`;
                sideboardCountMap.set(id, (sideboardCountMap.get(id) || 0) + 1);
            }
        }
        const combinedSideboard = Array.from(sideboardCountMap, ([id, count]) => ({ id, count }));

        const jsonCardData = {
            metadata: {
                name: leaderPacks ? 'SWUDraftSim Sealed Pool' : 'SWUDraftSim Deck',
                author: "Unknown",
            },
            leader: {
                id: leaderPacks ? `${leaderPacks.flat()[0].cardData?.Set}_${leaderPacks.flat()[0].cardData?.Number}` : `${deckLeaders[0]?.cardData?.Set}_${deckLeaders[0]?.cardData?.Number}`,
                count: 1,
            },
            base: {
                id: base,
                count: 1,
            },
            deck: combinedDeck,
            sideboard: combinedSideboard,
        };
        navigator.clipboard.writeText(JSON.stringify(jsonCardData, null, 2));
        if (jsonCardData?.leader?.id === 'undefined_undefined') {
            setSnackbarStatus('warning')
            setSnackbarText('Copied JSON to Clipboard. No Leader Selected.');
        } else if (!jsonCardData?.base?.id) {
            setSnackbarStatus('warning')
            setSnackbarText('Copied JSON to Clipboard. No Base Selected.');
        } else {
            setSnackbarStatus('success');
            setSnackbarText('Copied JSON to Clipboard')
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    }

    //Styles
    const styles = {
        copyJsonButton: {
            fontSize: '0.8rem',
            backgroundColor: 'rgba(65, 65, 65, 1)',
            borderRadius: '5px',
            mt: '0.5rem',
            p: '0.2rem 0.4rem',
            '&:hover': {
                filter: 'brightness(1.2)',
            },
        },
    };

    return (
        <>
            <Box sx={{ color: "white", display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                <Button variant='contained' sx={styles.copyJsonButton} onClick={handleCopyJson}>Copy Json</Button>
            </Box>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
            >
                <MuiAlert
                    onClose={handleClose}
                    severity={snackbarStatus}
                    sx={{ width: '100%', backgroundColor: snackbarColor, color: 'black' }}
                >
                    {snackbarText}
                </MuiAlert>
            </Snackbar>
        </>
    );
}
