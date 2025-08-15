import { Button } from '@mui/material';

export default function StartButton({ isLoading, children, onClick }) {
    //Styles
    const styles = {
        StartButton: {
            display: isLoading ? 'none' : 'flex',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '30px',
            p: '0.6rem',
            fontSize: '1.3rem',
            boxShadow: '0 0 7px rgba(31, 202, 255, 1)',
            outline: '1px solid rgba(31, 202, 255, 0.7)',
            transition: 'all 0.3s',
            '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                boxShadow: '0 0 12px rgba(31, 202, 255, 1)',
                outline: '1px solid rgba(31, 202, 255, 0.7)',
            },
        },
    };

    return (
        <Button variant='contained' sx={styles.StartButton} onClick={onClick}>{children}</Button>
    );
}
