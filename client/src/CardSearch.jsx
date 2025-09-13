import { useEffect, useState } from "react";
import { Box, Typography, Button, Grid } from '@mui/material';

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
        cardSearchContainer: {
            width: '90%',
            m: '0 auto 0 auto',
            color: 'white',
        },
        title: {
            m: '5rem auto 2rem auto',
            textAlign: 'center',
        },
        form: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
    }

    return (
        <Box sx={styles.cardSearchContainer}>
            <Typography variant='h4' component='h2' sx={styles.title}>Card Search</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="2 cost green hero..."
                        style={{ padding: "0.5rem", width: "400px", borderRadius: '5px', border: '1px solid white' }}
                    />
                    <Button type="submit" disabled={loading}>
                        {loading ? "Searching..." : "Search"}
                    </Button>
                </form>
            </Box>
            {cards.length > 0 && (
                <Box mt={4}>
                    <Typography variant="h5" gutterBottom>
                        Found Cards ({total}):
                    </Typography>

                    {/* Top Pagination Controls */}
                    <Box display="flex" gap={1} alignItems="center" mb={2}>
                        <Button
                            variant="contained"
                            disabled={loading || page <= 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                        >
                            Prev
                        </Button>
                        <Typography>Page {page} / {totalPages}</Typography>
                        <Button
                            variant="contained"
                            disabled={loading || page >= totalPages}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        >
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
                    <Box display="flex" gap={1} alignItems="center" mt={2}>
                        <Button
                            variant="contained"
                            disabled={loading || page <= 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                        >
                            Prev
                        </Button>
                        <Typography>Page {page} / {totalPages}</Typography>
                        <Button
                            variant="contained"
                            disabled={loading || page >= totalPages}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        >
                            Next
                        </Button>
                    </Box>
                </Box>
            )}

        </Box>
    );
}
