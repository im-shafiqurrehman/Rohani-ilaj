/*
 * Calendly's inline widget only posts back two URIs when a slot is booked —
 * `event.uri` and `invitee.uri`. It does NOT include the date/time, which is
 * why the admin panel's Slot column was empty: there was nothing to store.
 * Start time, end time and the generated meeting link come from the API.
 *
 * TWO ACCOUNTS, TWO TOKENS
 * Calendly's Free plan allows one event type per account, so the call and the
 * physical session live on separate accounts. A token only authorises the
 * account that issued it — using the call token against a physical-session
 * event returns 401/404 — so the token is chosen by service type.
 *
 * Cost: reading scheduled events works on the Free plan. Only webhooks and
 * three Enterprise-specific endpoints require a paid subscription, and this
 * uses neither.
 */

const EVENT_URI = /^https:\/\/api\.calendly\.com\/scheduled_events\/[A-Za-z0-9-]+$/;

/** Token for a service, falling back to the shared one when both event types
 *  happen to live on the same (paid) account. */
function tokenFor(serviceType) {
  const shared = process.env.CALENDLY_API_TOKEN || "";
  if (serviceType === "physical") {
    return process.env.CALENDLY_API_TOKEN_PHYSICAL || shared;
  }
  return process.env.CALENDLY_API_TOKEN_CALL || shared;
}

function isConfigured() {
  return Boolean(tokenFor("call") || tokenFor("physical"));
}

/**
 * A short, quotable reference for the slot, derived from the event UUID.
 * This is what a customer can read out on WhatsApp — "my slot is 4F2A9C31" —
 * and what the ustad can match against without reading a full URI.
 */
function slotReference(eventUri) {
  if (!eventUri) return "";
  const uuid = String(eventUri).split("/").pop() || "";
  return uuid.replace(/-/g, "").slice(-8).toUpperCase();
}

async function requestEvent(eventUri, token) {
  const res = await fetch(eventUri, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return { status: res.status, resource: null };
  const body = await res.json();
  return { status: res.status, resource: body.resource || null };
}

/**
 * Looks up a booked slot. Returns null rather than throwing on every failure
 * path — a booking must still be accepted if Calendly is unreachable or a
 * token is missing, because the customer has already paid by this point.
 */
async function fetchScheduledEvent(eventUri, serviceType) {
  if (!eventUri) return null;

  // The URI arrives from the browser, so it is untrusted input that we are
  // about to send an authenticated request to. Pin it to Calendly's own API
  // host and path shape, otherwise this is an SSRF that leaks the token.
  if (!EVENT_URI.test(eventUri)) {
    console.warn("Rejected a non-Calendly event URI:", eventUri);
    return null;
  }

  const primary = tokenFor(serviceType);
  if (!primary) {
    console.warn(
      `No Calendly token for serviceType "${serviceType}". Set CALENDLY_API_TOKEN_CALL / CALENDLY_API_TOKEN_PHYSICAL.`
    );
    return null;
  }

  try {
    let { status, resource } = await requestEvent(eventUri, primary);

    // A 401/404 usually means the two tokens are swapped in .env. Try the
    // other account once so a misconfiguration doesn't silently lose the slot,
    // and say so loudly enough to be fixed.
    if (!resource && (status === 401 || status === 404)) {
      const other =
        serviceType === "physical"
          ? process.env.CALENDLY_API_TOKEN_CALL
          : process.env.CALENDLY_API_TOKEN_PHYSICAL;

      if (other && other !== primary) {
        const retry = await requestEvent(eventUri, other);
        if (retry.resource) {
          console.warn(
            `Calendly: "${serviceType}" event resolved with the OTHER account's token. ` +
              `CALENDLY_API_TOKEN_CALL and CALENDLY_API_TOKEN_PHYSICAL are probably swapped in .env.`
          );
          resource = retry.resource;
        }
      }
    }

    if (!resource) {
      console.warn(`Calendly lookup failed (${status}) for ${eventUri}`);
      return null;
    }

    const location = resource.location || {};

    return {
      startTime: resource.start_time ? new Date(resource.start_time) : undefined,
      endTime: resource.end_time ? new Date(resource.end_time) : undefined,
      eventName: resource.name || "",
      // Calendly generates the Google Meet / Zoom link itself, so the ustad
      // doesn't have to create and paste one when approving.
      joinUrl: location.join_url || "",
      locationType: location.type || "",
    };
  } catch (err) {
    console.warn("Calendly lookup error:", err.message);
    return null;
  }
}

module.exports = { fetchScheduledEvent, slotReference, isConfigured, tokenFor };
