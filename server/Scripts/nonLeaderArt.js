const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '../.env' });

const uri = process.env.MONGO_URI;
console.log('Mongo URI:', uri);
const client = new MongoClient(uri);

async function updateNonLeaderArt() {
    try {
        await client.connect();
        const db = client.db(process.env.DB_NAME);
        const collection = db.collection(process.env.COLLECTION_NAME);

        // Select which documents to update
        const cursor = collection.find({ Set: 'LOF', Type: { $ne: 'Leader' } });

        while (await cursor.hasNext()) {
            const doc = await cursor.next();
            const cardNumber = doc.Number;

            if (cardNumber) {
                const newUrl = `https://cdn.swudraftsim.com/LOF/${cardNumber}.webp`;

                await collection.updateOne(
                    { _id: doc._id },
                    { $set: { FrontArt: newUrl } }
                );

                console.log(`Updated ${doc.Name} (${cardNumber})`);
            }
        }

        console.log('✅ All documents updated.');
    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await client.close();
    }
}

updateNonLeaderArt();
