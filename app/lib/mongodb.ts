import { MongoClient } from 'mongodb';

// Check if MONGODB_URI is defined
if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  // Add any MongoDB client options here if needed
};

// Define global interface for TypeScript
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Initialize client outside to ensure proper typing
const client = new MongoClient(uri, options);
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve the value
  // across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    clientPromise = client.connect();
    global._mongoClientPromise = clientPromise;
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise
export default clientPromise; 