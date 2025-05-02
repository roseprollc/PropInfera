import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

if (!uri) {
  throw new Error("⚠️ MONGODB_URI is not defined in the environment variables.");
}

let client: MongoClient;
let mongoClientPromise: Promise<MongoClient>;

// Global is used in development to preserve the MongoClient across hot reloads
declare global {
  // Allow globalThis._mongoClientPromise to exist as a dev-only workaround
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  mongoClientPromise = global._mongoClientPromise;
} else {
  // In production, always create a new client for each invocation
  client = new MongoClient(uri, options);
  mongoClientPromise = client.connect();
}

// Stub function for testing
export const getStubClient = async () => ({
  db: () => ({
    collection: () => ({
      insertOne: async () => ({ insertedId: 'stub' }),
      updateOne: async () => ({ modifiedCount: 1 })
    })
  })
});

export default mongoClientPromise;
