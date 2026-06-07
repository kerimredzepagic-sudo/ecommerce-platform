import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongo: MongoMemoryServer;

/**
 * Spin up a throwaway in-memory MongoDB and connect Mongoose to it.
 * Tests run against the real Mongoose driver and real BSON behaviour,
 * so model validation, hooks and indexes are all exercised for real.
 */
export async function connectTestDB(): Promise<void> {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
}

/** Drop every collection between tests so each test starts clean. */
export async function clearTestDB(): Promise<void> {
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
}

/** Tear down the connection and stop the in-memory server. */
export async function closeTestDB(): Promise<void> {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
}
