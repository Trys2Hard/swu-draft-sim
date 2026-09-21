const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '../.env' });

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

const isExecute = process.argv.includes('--execute');

async function updateArrayFields() {
  try {
    await client.connect();

    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.COLLECTION_NAME);

    const filter = {
      // Name: 'Arena Acklay',
      $or: [
        { 'Aspects.S': { $exists: true } },
        { 'Traits.S': { $exists: true } },
        { 'Arenas.S': { $exists: true } },
        { 'Keywords.S': { $exists: true } },
      ],
    };

    console.log(
      isExecute
        ? '🚀 EXECUTE MODE - Database will be modified'
        : '🔍 DRY RUN - Database will NOT be modified',
    );

    const count = await collection.countDocuments(filter);

    console.log(`Found ${count} documents containing old S objects.`);

    if (count === 0) {
      console.log('✅ Nothing needs to be updated.');
      return;
    }

    // Show a few examples before making changes
    const examples = await collection.find(filter).limit(5).toArray();

    console.log('\nExamples of cards that need updating:\n');

    for (const doc of examples) {
      console.log(`📋 ${doc.Name} (${doc.Set}-${doc.Number})`);

      if (doc.Aspects?.some((item) => item && typeof item === 'object')) {
        console.log('  Aspects:', doc.Aspects);
      }

      if (doc.Traits?.some((item) => item && typeof item === 'object')) {
        console.log('  Traits:', doc.Traits);
      }

      if (doc.Arenas?.some((item) => item && typeof item === 'object')) {
        console.log('  Arenas:', doc.Arenas);
      }

      if (doc.Keywords?.some((item) => item && typeof item === 'object')) {
        console.log('  Keywords:', doc.Keywords);
      }

      console.log('');
    }

    // Stop here if we're doing a dry run
    if (!isExecute) {
      console.log('-----------------------------------');
      console.log('🔍 DRY RUN COMPLETE');
      console.log('No documents were modified.');
      console.log('');
      console.log('If everything looks correct, run:');
      console.log('node updateArrayFields.js --execute');
      return;
    }

    // Actual update
    const update = [
      {
        $set: {
          Aspects: {
            $map: {
              input: { $ifNull: ['$Aspects', []] },
              as: 'item',
              in: {
                $cond: [
                  { $eq: [{ $type: '$$item' }, 'object'] },
                  '$$item.S',
                  '$$item',
                ],
              },
            },
          },

          Traits: {
            $map: {
              input: { $ifNull: ['$Traits', []] },
              as: 'item',
              in: {
                $cond: [
                  { $eq: [{ $type: '$$item' }, 'object'] },
                  '$$item.S',
                  '$$item',
                ],
              },
            },
          },

          Arenas: {
            $map: {
              input: { $ifNull: ['$Arenas', []] },
              as: 'item',
              in: {
                $cond: [
                  { $eq: [{ $type: '$$item' }, 'object'] },
                  '$$item.S',
                  '$$item',
                ],
              },
            },
          },

          Keywords: {
            $map: {
              input: { $ifNull: ['$Keywords', []] },
              as: 'item',
              in: {
                $cond: [
                  { $eq: [{ $type: '$$item' }, 'object'] },
                  '$$item.S',
                  '$$item',
                ],
              },
            },
          },
        },
      },
    ];

    console.log('🔄 Updating documents...');

    const result = await collection.updateMany(filter, update);

    console.log(`Matched: ${result.matchedCount}`);
    console.log(`Modified: ${result.modifiedCount}`);

    const remaining = await collection.countDocuments(filter);

    console.log(`Remaining old S objects: ${remaining}`);

    if (remaining === 0) {
      console.log('✅ Migration completed successfully!');
    } else {
      console.log('⚠️ Some documents still contain S objects.');
    }
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await client.close();
  }
}

updateArrayFields();
