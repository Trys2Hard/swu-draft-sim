import { useState } from "react";

export default function CardSearch() {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
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
            setResponse(data.text);
        } catch (err) {
            console.error(err);
            setResponse("Error fetching response");
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Gemini + Vite + Express</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ask Gemini something..."
                    style={{ padding: "0.5rem", width: "300px" }}
                />
                <button type="submit" style={{ marginLeft: "1rem" }}>
                    Send
                </button>
            </form>
            {response && (
                <div style={{ marginTop: "1rem" }}>
                    <strong>Gemini says:</strong>
                    <p>{response}</p>
                </div>
            )}
        </div>
    );
}
