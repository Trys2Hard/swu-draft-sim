import { Button } from '@mui/material';

export default function StartButton({ isLoading, children, onClick }) {
    //Styles
    const styles = {
        StartButton: {
            display: isLoading ? 'none' : 'flex',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '30px',
            p: '0.6rem',
            fontSize: '1rem',
            boxShadow: '0 0 8px rgba(31, 202, 255, 1)',
            outline: '1px solid rgba(31, 202, 255, 1)',
            transition: 'all 0.6s',
            '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                boxShadow: '0 0 18px rgba(31, 202, 255, 1)',
                outline: '1px solid rgba(31, 202, 255, 1)',
            },
        },
    };

    return (
        <Button variant='contained' sx={styles.StartButton} onClick={onClick}>{children}</Button>
    );
}
