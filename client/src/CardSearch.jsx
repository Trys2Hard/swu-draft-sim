import { useEffect, useState } from "react";

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
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/gemini`, {
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

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Card Search</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Search for specific cards..."
                    style={{ padding: "0.5rem", width: "400px" }}
                />
                <button type="submit" disabled={loading} style={{ marginLeft: "1rem", padding: "0.5rem 1rem" }}>
                    {loading ? "Searching..." : "Search"}
                </button>
            </form>

            {cards.length > 0 && (
                <div style={{ marginTop: "2rem" }}>
                    <h2>Found Cards ({total}):</h2>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button disabled={loading || page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
                        <span>Page {page} / {totalPages}</span>
                        <button disabled={loading || page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</button>
                    </div>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                        gap: "1rem",
                        marginTop: "1rem"
                    }}>
                        {cards.map((card, index) => (
                            <div key={index} style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                {card.frontArt && (
                                    <img
                                        src={card.frontArt}
                                        alt={card.name}
                                        style={{
                                            width: "200px",
                                            height: "auto",
                                            borderRadius: "8px",
                                            objectFit: "cover",
                                            boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
                                        }}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '1rem' }}>
                        <button disabled={loading || page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
                        <span>Page {page} / {totalPages}</span>
                        <button disabled={loading || page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</button>
                    </div>
                </div>
            )}
        </div>
    );
}
