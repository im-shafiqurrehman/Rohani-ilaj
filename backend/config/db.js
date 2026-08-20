const mongoose = require("mongoose");

async function dropStaleIndexes() {
  const stale = [{ collection: "bookings", index: "transactionId_1" }];

  for (const { collection, index } of stale) {
    try {
      const col = mongoose.connection.collection(collection);
      const existing = await col.indexes();
      if (existing.some((i) => i.name === index)) {
        await col.dropIndex(index);
        console.log(`Dropped stale index ${collection}.${index}`);
      }
    } catch (err) {
      // A fresh database simply won't have it. Never block startup for this.
      if (err.codeName !== "IndexNotFound" && err.codeName !== "NamespaceNotFound") {
        console.warn(`Could not drop ${collection}.${index}: ${err.message}`);
      }
    }
  }
}

const MAX_ATTEMPTS = 5;
const BASE_DELAY_MS = 2000;

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const cache = globalThis.__mongooseConn || (globalThis.__mongooseConn = { promise: null });

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  if (cache.promise) return cache.promise;
  cache.promise = doConnect().catch((err) => {
    cache.promise = null;
    throw err;
  });
  return cache.promise;
}

async function doConnect() {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log("MongoDB connected");
      await dropStaleIndexes();
      return;
    } catch (err) {
      const last = attempt === MAX_ATTEMPTS;
      const delay = BASE_DELAY_MS * attempt;
      console.error(
        `MongoDB connection failed (attempt ${attempt}/${MAX_ATTEMPTS}): ${err.message}`
      );
      if (last) {
        console.error(
          "\nGiving up. Common causes:\n" +
            "  - No internet, or DNS cannot resolve the Atlas SRV record\n" +
            "  - Your current IP is not in the Atlas Network Access allowlist\n" +
            "  - The free-tier cluster is paused (Atlas pauses after 60 idle days)\n"
        );
        process.exit(1);
      }
      console.error(`Retrying in ${delay / 1000}s…`);
      await wait(delay);
    }
  }
}

module.exports = connectDB;
