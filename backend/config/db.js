const mongoose = require("mongoose");

/*
 * Mongoose creates indexes declared on a schema but never drops ones that were
 * removed from it. The old form made transactionId unique; now that the field
 * is optional, that leftover index would reject the SECOND booking that omits
 * it — MongoDB treats a missing value as null, and null collides with null
 * under a non-sparse unique index. So it has to be dropped explicitly, once.
 */
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

/*
 * Retries the initial connection before giving up.
 *
 * This used to exit(1) on the first failure, which turned a momentary DNS
 * hiccup — a single EREFUSED on the Atlas SRV lookup — into a backend that
 * stayed down indefinitely: nodemon does not restart a process that exited
 * cleanly, it waits for a file change. Meanwhile every request from the
 * browser fails with a bare "Failed to fetch".
 *
 * Once connected, mongoose handles reconnection itself; this only covers
 * startup.
 */
async function connectDB() {
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
