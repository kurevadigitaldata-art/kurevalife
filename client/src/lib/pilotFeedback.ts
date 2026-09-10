const PILOT_API_URL = "https://ikhvfugfmqulxbxrkdvl.supabase.co";
const PILOT_PUBLISHABLE_KEY = "sb_publishable_uVi6uJwOgzHrbEg6AkgBTA_FhDWk358";

export type ExperienceArea = "kurevalife_simulator" | "calculator_report" | "accessibility" | "general";
export type FeedbackType = "observation" | "problem" | "idea" | "accessibility" | "encouragement";
export type FeedbackCategory =
  | "clarity"
  | "daily_blocks"
  | "reminders"
  | "medical_organization"
  | "nutrition"
  | "accessibility"
  | "privacy"
  | "kivi_support"
  | "family_mode"
  | "community"
  | "other";
export type AccessibilityContext =
  | "not_shared"
  | "screen_reader"
  | "low_vision"
  | "deaf_or_hard_of_hearing"
  | "motor_or_dexterity"
  | "cognitive_or_attention"
  | "other";
export type CommunityCategory = "daily_blocks" | "medical_organization" | "nutrition" | "accessibility" | "privacy" | "kivi_support" | "family_mode" | "general";
export type EntrySource = "invitacion_directa" | "referido" | "directo";

export type PilotFeedbackPayload = {
  ticket_code: string;
  experience_area: ExperienceArea;
  feedback_type: FeedbackType;
  feedback_category: FeedbackCategory;
  rating: number;
  message: string;
  accessibility_context: AccessibilityContext;
  is_anonymous: boolean;
  sender_name: string | null;
  entry_source: EntrySource;
  consent_privacy: true;
};

export type PilotInterestPayload = {
  email: string;
  participation_role: "persona" | "apoyo" | "profesional" | "comunidad" | "otro";
  consent_updates: true;
  consent_kit_updates: boolean;
  consent_launch_notifications: boolean;
  consent_project_updates: boolean;
  consent_gift_updates: boolean;
  entry_source: EntrySource;
  consent_privacy: true;
};

export type CommunityMessage = {
  id: string;
  display_name: string;
  is_anonymous: boolean;
  category: CommunityCategory;
  message: string;
  created_at: string;
  visible_until: string;
};

export type CommunityMessagePayload = {
  display_name: string;
  is_anonymous: boolean;
  category: CommunityCategory;
  message: string;
  consent_public: true;
  visible_until: string;
};

function getErrorMessage(body: unknown) {
  if (typeof body === "object" && body !== null && "message" in body && typeof body.message === "string") return body.message;
  return "No se ha podido registrar ahora. Revisa tu conexión e inténtalo de nuevo.";
}

function headers(prefer = "return=minimal") {
  return {
    apikey: PILOT_PUBLISHABLE_KEY,
    Authorization: `Bearer ${PILOT_PUBLISHABLE_KEY}`,
    "Content-Type": "application/json",
    Prefer: prefer,
  };
}

async function postToPilotTable(table: "pilot_feedback" | "pilot_interest" | "pilot_community_messages", payload: PilotFeedbackPayload | PilotInterestPayload | CommunityMessagePayload) {
  const response = await fetch(`${PILOT_API_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: headers(),
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

export async function submitCommunityMessage(payload: CommunityMessagePayload) {
  await postToPilotTable("pilot_community_messages", payload);
}

export async function loadCommunityMessages() {
  const now = encodeURIComponent(new Date().toISOString());
  const response = await fetch(`${PILOT_API_URL}/rest/v1/pilot_community_messages?select=id,display_name,is_anonymous,category,message,created_at,visible_until&visible_until=gt.${now}&order=created_at.desc&limit=30`, {
    headers: headers(),
  });
  if (!response.ok) {
    let body: unknown = null;
    try { body = await response.json(); } catch { /* No structured response available. */ }
    throw new Error(getErrorMessage(body));
  }
  return response.json() as Promise<CommunityMessage[]>;
}

export async function loadPilotWindow() {
  const response = await fetch(`${PILOT_API_URL}/rest/v1/pilot_windows?select=starts_at,ends_at&window_key=eq.kurevalife_72h&limit=1`, {
    headers: headers(),
  });
  if (!response.ok) {
    let body: unknown = null;
    try { body = await response.json(); } catch { /* No structured response available. */ }
    throw new Error(getErrorMessage(body));
  }
  const windows = await response.json() as { starts_at: string; ends_at: string }[];
  return windows[0] ?? null;
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

export function getPilotEntrySource(): EntrySource {
  const storedSource = sessionStorage.getItem("kureva-pilot-entry-source") as EntrySource | null;
  if (storedSource === "invitacion_directa" || storedSource === "referido" || storedSource === "directo") return storedSource;
  const source = new URLSearchParams(window.location.search).get("origen");
  const resolved: EntrySource = source === "referido" ? "referido" : source === "invitacion" ? "invitacion_directa" : "directo";
  sessionStorage.setItem("kureva-pilot-entry-source", resolved);
  return resolved;
}
