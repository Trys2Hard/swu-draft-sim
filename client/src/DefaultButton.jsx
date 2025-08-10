import { Button } from '@mui/material';

export default function DefaultButton({ draftStarted, children, onClick }) {
    const styles = {
        DefaultButton: {
            display: draftStarted ? 'none' : 'flex',
            backgroundColor: 'rgba(73, 73, 73, 1)',
            borderRadius: '20px',
            p: '0.6rem',
            '&:hover': {
                background: 'linear-gradient(rgba(125, 125, 125, 1), rgba(31, 202, 255, 0.5))',
            },
        },
    }

    return (
        <Button variant='contained' sx={styles.DefaultButton} onClick={onClick}>{children}</Button>
    )
}