import { Box, Button, Typography } from '@mui/material';

export default function PageButtons({ loading, page, totalPages, setPage }) {
    //Styles
    const styles = {
        pageButton: {
            backgroundColor: 'rgba(60, 60, 60, 1)',
            boxShadow: '-3px 3px 5px black',
            p: '0.3rem',
            '&:hover': {
                filter: 'brightness(1.2)',
            },
            '&.Mui-disabled': {
                color: 'black',
                backgroundColor: 'rgba(130, 130, 130, 1)',
            }
        },
        pageNum: {
            cursor: "pointer",
            textDecoration: "none",
            p: '0.3rem 0.4rem 0.3rem 0.4rem',
            borderRadius: '7px',
            "&:hover": {
                filter: 'brightness(1.2)',
            },
        },
    }

    return (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', width: '95%', m: '0.3rem auto 0rem auto', color: 'white' }}>
            <Button
                variant="contained"
                disabled={loading || page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                sx={styles.pageButton}
            >
                Prev
            </Button>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                        <Typography
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            sx={{
                                ...styles.pageNum,
                                fontWeight: page === pageNum ? "bold" : "normal",
                                backgroundColor: page === pageNum ? 'rgba(70, 70, 70, 1)' : 'rgba(40, 40, 40, 1)'
                            }}
                        >
                            {pageNum}
                        </Typography>
                    );
                })}
            </Box>


            <Button
                variant="contained"
                disabled={loading || page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                sx={styles.pageButton}
            >
                Next
            </Button>
        </Box>
    )
}