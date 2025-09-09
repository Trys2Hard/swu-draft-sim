import { useState } from "react";

export default function CardSearch() {
    const [prompt, setPrompt] = useState("");
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/gemini`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt }),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const data = await res.json();
            setCards(data.cards || []);
        } catch (err) {
            console.error(err);
            setCards([]);
        } finally {
            setLoading(false);
        }
    };

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
                    <h2>Found Cards ({cards.length}):</h2>
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
                </div>
            )}
        </div>
    );
}
