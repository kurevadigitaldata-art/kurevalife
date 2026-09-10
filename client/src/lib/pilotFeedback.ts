const PILOT_API_URL = "https://ikhvfugfmqulxbxrkdvl.supabase.co";
const PILOT_PUBLISHABLE_KEY = "sb_publishable_uVi6uJwOgzHrbEg6AkgBTA_FhDWk358";

export type ExperienceArea = "kurevalife_simulator" | "calculator_report" | "accessibility" | "general";
export type FeedbackType = "observation" | "problem" | "idea" | "accessibility" | "encouragement";
export type AccessibilityContext =
  | "not_shared"
  | "screen_reader"
  | "low_vision"
  | "deaf_or_hard_of_hearing"
  | "motor_or_dexterity"
  | "cognitive_or_attention"
  | "other";

export type PilotFeedbackPayload = {
  ticket_code: string;
  experience_area: ExperienceArea;
  feedback_type: FeedbackType;
  message: string;
  accessibility_context: AccessibilityContext;
  consent_privacy: true;
};

export type PilotInterestPayload = {
  email: string;
  participation_role: "persona" | "apoyo" | "profesional" | "comunidad" | "otro";
  consent_updates: true;
  consent_kit_updates: boolean;
  consent_privacy: true;
};

function getErrorMessage(body: unknown) {
  if (typeof body === "object" && body !== null && "message" in body && typeof body.message === "string") return body.message;
  return "No se ha podido registrar ahora. Revisa tu conexión e inténtalo de nuevo.";
}

async function postToPilotTable(table: "pilot_feedback" | "pilot_interest", payload: PilotFeedbackPayload | PilotInterestPayload) {
  const response = await fetch(`${PILOT_API_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: PILOT_PUBLISHABLE_KEY,
      Authorization: `Bearer ${PILOT_PUBLISHABLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let body: unknown = null;
    try { body = await response.json(); } catch { /* No structured response available. */ }
    throw new Error(getErrorMessage(body));
  }
}

export async function submitPilotFeedback(payload: PilotFeedbackPayload) {
  await postToPilotTable("pilot_feedback", payload);
}

export async function submitPilotInterest(payload: PilotInterestPayload) {
  await postToPilotTable("pilot_interest", payload);
}

export function getPilotTicket() {
  const storedTicket = sessionStorage.getItem("kureva-pilot-ticket");
  if (storedTicket) return storedTicket;
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const values = crypto.getRandomValues(new Uint8Array(6));
  const ticket = `KUREVA-${Array.from(values, (value) => alphabet[value % alphabet.length]).join("")}`;
  sessionStorage.setItem("kureva-pilot-ticket", ticket);
  return ticket;
}
