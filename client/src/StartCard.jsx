import { Box } from '@mui/material';
import StartButton from './StartButton';

export default function StartCard({ cardSet, isLoading, handleStartDraft, draftPage, sealedPage, children }) {
    const styles = {
        packBox: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '281.5px',
            minHeight: '478.5px',
            m: '0 auto 1rem auto',
            // backgroundImage: !draftStarted ? 'url(/LOF_box_art_card.jpg)' : 'url(/LOF_box_art_full.jpg)',
            backgroundImage: cardSet === 'sec' ? 'url(/SEC_box_art_card.jpg)' : cardSet === 'lof' ? 'url(/LOF_box_art_card.jpg)' : 'none',
            backgroundSize: 'contain',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            color: 'white',
            borderRadius: '10px',
            boxShadow: '-4px 4px 8px black',
        },
    }

    return (
        <Box sx={styles.packBox}>
            <StartButton isLoading={isLoading} draftPage={draftPage} sealedPage={sealedPage} onClick={() => handleStartDraft()}>
                {children}
            </StartButton>
        </Box>
    );
}