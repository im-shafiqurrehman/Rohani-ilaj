#!/usr/bin/env node
/*
 * Fills in slot details for bookings taken before the Calendly tokens were
 * live:  npm run backfill:slots
 *
 * Node reads process.env once at startup, so adding a token to .env does
 * nothing until the server restarts — any booking made in between stored an
 * event URI but no times. This resolves those retroactively.
 */
require("dotenv").config();
const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const { fetchScheduledEvent, slotReference } = require("../utils/calendly");

(async () => {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 });

  const pending = await Booking.find({
    calendlyEventUri: { $exists: true, $ne: "" },
    $or: [{ slotTime: { $exists: false } }, { slotTime: null }],
  });

  console.log(`\n${pending.length} booking(s) with an event URI but no slot time.\n`);

  let fixed = 0;
  for (const b of pending) {
    const slot = await fetchScheduledEvent(b.calendlyEventUri, b.serviceType);
    if (!slot?.startTime) {
      console.log(`  SKIP  ${b.customerName} — Calendly lookup returned nothing`);
      continue;
    }
    b.slotTime = slot.startTime;
    b.slotEndTime = slot.endTime;
    b.calendlyEventName = slot.eventName;
    if (!b.slotReference) b.slotReference = slotReference(b.calendlyEventUri);
    // Only fill the meeting link if the ustad hasn't set one by hand.
    if (!b.meetLink && slot.joinUrl) b.meetLink = slot.joinUrl;
    await b.save();
    fixed++;
    console.log(
      `  OK    ${b.customerName} — ${slot.startTime.toISOString()} (${b.slotReference})`
    );
  }

  console.log(`\n${fixed} updated, ${pending.length - fixed} skipped.\n`);
  await mongoose.disconnect();
})().catch((e) => {
  console.error("Backfill failed:", e.message);
  process.exit(1);
});
