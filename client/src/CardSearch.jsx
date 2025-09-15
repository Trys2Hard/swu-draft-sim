import { useEffect, useState } from "react";
import { Box, Typography, Button, Grid, FormControl, TextField } from '@mui/material';
import PageButtons from './PageButtons';

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
            // target the OutlinedInput root
            '& .MuiOutlinedInput-root': {
                color: 'white',                 // text color
                height: '2.5rem',               // height of the input wrapper
                borderRadius: '25px',           // border radius

                '& fieldset': {
                    borderColor: 'white',         // outlined border color
                },

                '&:hover fieldset': {
                    borderColor: 'white',         // border on hover
                },

                '&.Mui-focused fieldset': {
                    borderColor: 'white',         // border when focused
                },

                '& input': {
                    color: 'white',               // text color inside input
                    height: '2.5rem',
                    padding: '0 1rem',            // adjust horizontal padding
                },

                // autofill override
                '& input:-webkit-autofill': {
                    WebkitBoxShadow: '0 0 0 100px transparent inset',
                    WebkitTextFillColor: 'white',
                    transition: 'background-color 5000s ease-in-out 0s',
                },
                '& input:-webkit-autofill:focus': {
                    WebkitBoxShadow: '0 0 0 100px transparent inset',
                    WebkitTextFillColor: 'white',
                },
            },
        },
        searchButton: {
            ml: '1rem',
            background: 'rgba(31, 202, 255, 0.4)',
            borderRadius: '20px',
            p: '0.5rem 1rem 0.5rem 1rem',
            '&:hover': {
                background: 'rgba(31, 202, 255, 0.5)',
            }
        },
        cardContainer: {
            display: 'flex',
            justifyContent: 'center',
            width: '95%',
            p: '1rem',
            backgroundColor: 'rgba(35, 35, 35, 1)',
            m: '1rem auto',
            borderRadius: '10px',
        },
    }

    return (
        <>
            <Typography variant='h4' component='h2' sx={styles.title}>Card Search</Typography>
            <Box>
                <form onSubmit={handleSubmit}>
                    <FormControl sx={styles.form}>
                        <TextField
                            value={prompt}
                            fullWidth
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="2 cost green hero..."
                            id="card-search"
                            variant="outlined"
                            sx={styles.input}
                        />
                        <Button variant='contained' sx={styles.searchButton} type="submit">Search</Button>
                    </FormControl>
                </form>
            </Box>

            <Box>
                {cards.length > 0 && (
                    <Box mt={4}>
                        <Typography variant="h5" gutterBottom sx={{ width: '95%', m: '0 auto', color: 'white' }}>
                            Cards Found: {total}
                        </Typography>

                        {/* Top Pagination Controls */}
                        <PageButtons loading={loading} page={page} totalPages={totalPages} setPage={setPage} />

                        {/* Cards Grid */}
                        <Grid container spacing={4} sx={styles.cardContainer}>
                            {cards.map((card, index) => (
                                <Grid key={index}>
                                    <Box>
                                        {card.frontArt && (
                                            <Box
                                                component="img"
                                                src={card.frontArt}
                                                alt={card.name}
                                                sx={{
                                                    width: '20rem',
                                                    borderRadius: '15px',
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
                        <PageButtons loading={loading} page={page} totalPages={totalPages} setPage={setPage} />
                    </Box >
                )
                }
            </Box >
        </>
    );
}
