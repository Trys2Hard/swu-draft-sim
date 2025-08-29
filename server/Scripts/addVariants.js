const { MongoClient } = require("mongodb");
require('dotenv').config({ path: './.env' });

async function duplicateNonLeaderCards() {
    // Validate environment variables
    if (!process.env.MONGO_URI || !process.env.DB_NAME || !process.env.COLLECTION_NAME) {
        console.error("Error: Missing required environment variables. Please check MONGO_URI, DB_NAME, and COLLECTION_NAME in your .env file.");
        return;
    }

    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();

        const db = client.db(process.env.DB_NAME);
        const collection = db.collection(process.env.COLLECTION_NAME);

        // Pick set to update and non-leaders
        const cards = await collection
            .find({ Set: "LOF", Type: { $ne: "Leader" } })
            .toArray();

        console.log(`Found ${cards.length} non-leader cards to duplicate`);

        for (const card of cards) {
            try {
                // Validate required fields
                if (!card.Name || !card.Number) {
                    console.warn(`Skipping card with missing Name or Number:`, card);
                    continue;
                }

                // Convert Number string → integer with validation
                const oldNumber = parseInt(card.Number, 10);
                if (isNaN(oldNumber)) {
                    console.warn(`Skipping card with invalid Number: ${card.Name} (${card.Number})`);
                    continue;
                }

                const newNumber = (oldNumber + 740).toString().padStart(3, "0");

                // Update FrontArt URL with improved regex
                let newFrontArt = card.FrontArt;
                if (newFrontArt) {
                    // Escape special regex characters in card.Number
                    const escapedNumber = card.Number.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    newFrontArt = newFrontArt.replace(
                        new RegExp(`${escapedNumber}(?=\\.webp)`),
                        newNumber
                    );
                }

                // Create a copy without _id field (let MongoDB generate new one)
                const newCard = {
                    ...card,
                    Number: newNumber,
                    VariantType: "Hyperspace Foil",
                    FrontArt: newFrontArt,
                };

                // Remove _id to let MongoDB generate a new one
                delete newCard._id;

                await collection.insertOne(newCard);
                console.log(
                    `Duplicated card: ${card.Name} (${card.Number}) ➝ ${newCard.Number} [Hyperspace Foil]`
                );
            } catch (cardError) {
                console.error(`Error processing card ${card.Name}:`, cardError);
                // Continue with next card instead of stopping the entire process
            }
        }

        console.log("Duplication complete!");
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

duplicateNonLeaderCards();
