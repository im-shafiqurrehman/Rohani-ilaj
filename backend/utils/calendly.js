
const EVENT_URI = /^https:\/\/api\.calendly\.com\/scheduled_events\/[A-Za-z0-9-]+$/;

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

async function fetchScheduledEvent(eventUri, serviceType) {
  if (!eventUri) return null;

  // Untrusted input we send an authenticated request to — pin it, or it's an SSRF.
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
