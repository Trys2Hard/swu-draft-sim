const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '../.env' });

async function createHyperspaceCardData() {
  if (
    !process.env.MONGO_URI ||
    !process.env.DB_NAME ||
    !process.env.COLLECTION_NAME
  ) {
    console.error(
      'Error: Missing required environment variables. Please check MONGO_URI, DB_NAME, and COLLECTION_NAME in your .env file.',
    );
    return;
  }

  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();

    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.COLLECTION_NAME);

    const cards = await collection.find({ Set: 'LAW' }).toArray();

    console.log(`Found ${cards.length} cards to duplicate`);

    for (const card of cards) {
      try {
        if (!card.Name || !card.Number) {
          console.warn(`Skipping card with missing Name or Number:`, card);
          continue;
        }

        const oldNumber = parseInt(card.Number, 10);
        if (isNaN(oldNumber)) {
          console.warn(
            `Skipping card with invalid Number: ${card.Name} (${card.Number})`,
          );
          continue;
        }

        const newNumber = (oldNumber + 264).toString().padStart(3, '0');

        const escapedNumber = card.Number.replace(
          /[.*+?^${}()|[\]\\]/g,
          '\\$&',
        );

        const isLeader = card.Type === 'Leader';

        // Update FrontArt
        let newFrontArt = card.FrontArt;
        if (newFrontArt) {
          if (isLeader) {
            // Replace number in "007-front.webp" pattern
            newFrontArt = newFrontArt.replace(
              new RegExp(`${escapedNumber}(?=-front\\.webp)`),
              newNumber,
            );
          } else {
            // Replace number in "214.webp" pattern
            newFrontArt = newFrontArt.replace(
              new RegExp(`${escapedNumber}(?=\\.webp)`),
              newNumber,
            );
          }
        }

        // Update BackArt for leaders
        let newBackArt = card.BackArt;
        if (isLeader && newBackArt) {
          newBackArt = newBackArt.replace(
            new RegExp(`${escapedNumber}(?=-back\\.webp)`),
            newNumber,
          );
        }

        const newCard = {
          ...card,
          Number: newNumber,
          VariantType: 'Hyperspace',
          FrontArt: newFrontArt,
          ...(isLeader && { BackArt: newBackArt }),
        };

        delete newCard._id;

        await collection.insertOne(newCard);
        console.log(
          `Duplicated ${card.Type} card: ${card.Name} (${card.Number}) ➝ ${newCard.Number} [Hyperspace]`,
        );
      } catch (cardError) {
        console.error(`Error processing card ${card.Name}:`, cardError);
      }
    }

    console.log('Duplication complete!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

createHyperspaceCardData();
