const { MongoClient } = require('mongodb');
require('dotenv').config()

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;
const collectionName = process.env.COLLECTION_NAME;

const cardRank = {
    //Card Ranks Go Here
};

async function updateRanks() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        let totalUpdated = 0;

        for (const [name, rank] of Object.entries(cardRank)) {
            const result = await collection.updateMany(
                { Name: name, Set: 'LOF' },
                { $set: { Rank: rank } }
            );
            console.log(`Updated ${result.modifiedCount} document(s) for Name: "${name}"`);
            totalUpdated += result.modifiedCount;
        }

        console.log(`Done! Total documents updated: ${totalUpdated}`);
    } catch (err) {
        console.error('Error updating ranks:', err);
    } finally {
        await client.close();
    }
}

updateRanks();
