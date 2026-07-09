const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017"; // Assuming local, will adjust if env exists
const client = new MongoClient(process.env.MONGODB_URI || uri);

async function dump() {
    try {
        await client.connect();
        const db = client.db("bhutan_tourism");

        const collections = ["tours", "hotels", "experience_types", "destinations", "experiences"];

        for (const colName of collections) {
            console.log(`--- Collection: ${colName} ---`);
            const items = await db.collection(colName).find({}).limit(2).toArray();
            items.forEach(item => {
                console.log({
                    _id: item._id,
                    _id_str: item._id.toString(),
                    _id_type: typeof item._id,
                    name: item.name || item.title || item.slug
                });
            });
        }
    } finally {
        await client.close();
    }
}

dump();
