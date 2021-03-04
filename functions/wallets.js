// functions/wallets.js

const MongoClient = require("mongodb").MongoClient;

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://cryptowatch:kFWo6X1AzS6IgWEN@tfg-cluster.igim9.azure.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const DB_NAME = "cryptowatch";

let cachedDb = null;

const connectToDatabase = async (uri) => {
  // we can cache the access to our database to speed things up a bit
  // (this is the only thing that is safe to cache here)
  if (cachedDb) return cachedDb;

  const client = await MongoClient.connect(uri, {
    useUnifiedTopology: true,
  });

  cachedDb = client.db(DB_NAME);

  return cachedDb;
};

const queryDatabase = async (db) => {
  const wallets = await db.collection("wallets").find({}).toArray();

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(wallets),
  };
};

module.exports.handler = async (event, context) => {
  // otherwise the connection will never complete, since
  // we keep the DB connection alive
  context.callbackWaitsForEmptyEventLoop = false;

  const db = await connectToDatabase(MONGODB_URI);
  return queryDatabase(db);
};
