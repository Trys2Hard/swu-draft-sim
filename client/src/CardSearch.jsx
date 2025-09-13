import { useEffect, useState } from "react";
import { Box, Typography, Button, Grid, FormControl, TextField } from '@mui/material';

export default function CardSearch() {
    const [prompt, setPrompt] = useState("");
    const [cards, setCards] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchCards = async (targetPage) => {
        if (!prompt.trim()) {
            setCards([]);
            setTotal(0);
            setTotalPages(1);
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/card-search`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt, page: targetPage, pageSize }),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const data = await res.json();
            setCards(data.cards || []);
            setTotalPages(data.totalPages || 1);
            setTotal(data.total || (data.cards?.length ?? 0));
            setPage(data.page || targetPage || 1);
            setPageSize(data.pageSize || pageSize);
        } catch (err) {
            console.error(err);
            setCards([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Reset to first page on new search, then fetch
        setPage(1);
        await fetchCards(1);
    };

    useEffect(() => {
        // When page changes via Prev/Next, fetch that page (if there is a prompt)
        if (prompt.trim()) {
            fetchCards(page);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const styles = {
        title: {
            m: '5rem auto 2rem auto',
            textAlign: 'center',
            color: 'white',
        },
        form: {
            width: '60%',
            m: '0 auto 0 auto',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        input: {
            color: 'white',
            height: '2.5rem',
            border: '1px solid white',
            borderRadius: '25px',
        },
        searchButton: {
            height: '2.5rem',
            ml: '1rem',
        },
        cardSearchContainer: {
            width: '90%',
            m: '0 auto 0 auto',
            color: 'white',
        },
    }

    return (
        <>
            <Typography variant='h4' component='h2' sx={styles.title}>Card Search</Typography>
            <Box sx={styles.formContainer}>
                <form onSubmit={handleSubmit}>
                    <FormControl sx={styles.form}>
                        <TextField
                            value={prompt}
                            fullWidth
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="2 cost green hero..."
                            id="card-search"
                            variant="outlined"
                            slotProps={{
                                input: {
                                    sx: styles.input
                                },
                            }} />
                        <Button variant='contained' sx={styles.searchButton} type="submit">Search</Button>
                    </FormControl>
                </form>
            </Box>

            <Box sx={styles.cardSearchContainer}>
                {cards.length > 0 && (
                    <Box mt={4}>
                        <Typography variant="h5" gutterBottom>
                            Cards Found: {total}
                        </Typography>

                        {/* Top Pagination Controls */}
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2, }}>
                            <Button
                                variant="contained"
                                disabled={loading || page <= 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                sx={{
                                    '&.Mui-disabled': {
                                        color: 'black',
                                        backgroundColor: 'rgba(65, 65, 65, 1)',
                                    }
                                }}>
                                Prev
                            </Button>

                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                {[...Array(totalPages)].map((_, i) => {
                                    const pageNum = i + 1;
                                    return (
                                        <Typography
                                            key={pageNum}
                                            onClick={() => setPage(pageNum)}
                                            sx={{
                                                cursor: "pointer",
                                                fontWeight: page === pageNum ? "bold" : "normal",
                                                textDecoration: page === pageNum ? "underline" : "none",
                                                "&:hover": { color: "primary.main" },
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
                                sx={{
                                    '&.Mui-disabled': {
                                        color: 'black',
                                        backgroundColor: 'rgba(65, 65, 65, 1)',
                                    }
                                }}>
                                Next
                            </Button>
                        </Box>


                        {/* Cards Grid */}
                        <Grid container spacing={2}>
                            {cards.map((card, index) => (
                                <Grid key={index}>
                                    <Box display="flex" justifyContent="center" alignItems="center">
                                        {card.frontArt && (
                                            <Box
                                                component="img"
                                                src={card.frontArt}
                                                alt={card.name}
                                                sx={{
                                                    width: 200,
                                                    height: 'auto',
                                                    borderRadius: 2,
                                                    objectFit: 'cover',
                                                    boxShadow: 3
                                                }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        )}
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Bottom Pagination Controls */}
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2, }}>
                            <Button
                                variant="contained"
                                disabled={loading || page <= 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                sx={{
                                    '&.Mui-disabled': {
                                        color: 'black',
                                        backgroundColor: 'rgba(65, 65, 65, 1)',
                                    }
                                }}>
                                Prev
                            </Button>

                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                {[...Array(totalPages)].map((_, i) => {
                                    const pageNum = i + 1;
                                    return (
                                        <Typography
                                            key={pageNum}
                                            onClick={() => setPage(pageNum)}
                                            sx={{
                                                cursor: "pointer",
                                                fontWeight: page === pageNum ? "bold" : "normal",
                                                textDecoration: page === pageNum ? "underline" : "none",
                                                "&:hover": { color: "primary.main" },
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
                                sx={{
                                    '&.Mui-disabled': {
                                        color: 'black',
                                        backgroundColor: 'rgba(65, 65, 65, 1)',
                                    }
                                }}>
                                Next
                            </Button>
                        </Box>
                    </Box >
                )
                }

            </Box >
        </>
    );
}
