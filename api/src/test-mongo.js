const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://ahilal:test1234@procurement.alcpyzj.mongodb.net/?appName=procurement";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.log("❌ Connection failed:", err.message);
  } finally {
    await client.close();
  }
}

run();