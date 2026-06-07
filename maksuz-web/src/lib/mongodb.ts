import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalWithMongooseCache = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

if (!globalWithMongooseCache.mongooseCache) {
  globalWithMongooseCache.mongooseCache = {
    conn: null,
    promise: null,
  };
}

const cache = globalWithMongooseCache.mongooseCache;

export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside your .env.local file."
    );
  }

  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, {
      bufferCommands: false,
    });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
