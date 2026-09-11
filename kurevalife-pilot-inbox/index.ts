import "jsr:@supabase/functions-js/edge-runtime.d.ts";

type FeedbackPayload = {
  ticket_code: string;
  experience_area: "kurevalife_simulator" | "calculator_report" | "accessibility" | "general";
  feedback_type: "observation" | "problem" | "idea" | "accessibility" | "encouragement";
  feedback_category: string;
  rating: number;
  message: string;
  accessibility_context: string;
  is_anonymous: boolean;
  sender_name: string | null;
  entry_source: "invitacion_directa" | "referido" | "directo";
  consent_privacy: true;
};

type InterestPayload = {
  email: string;
  participation_role: "persona" | "apoyo" | "profesional" | "comunidad" | "otro";
  consent_updates: true;
  consent_kit_updates: boolean;
  consent_launch_notifications: boolean;
  consent_project_updates: boolean;
  consent_gift_updates: boolean;
  entry_source: "invitacion_directa" | "referido" | "directo";
  consent_privacy: true;
};

type CommunityPayload = {
  display_name: string;
  is_anonymous: boolean;
  category: "daily_blocks" | "medical_organization" | "nutrition" | "accessibility" | "privacy" | "kivi_support" | "family_mode" | "general";
  message: string;
  consent_public: true;
};

const PILOT_CLOSES_AT = "2026-09-14T18:00:00.000Z"; // Monday, 20:00 Europe/Madrid.
const allowedOrigins = new Set([
  "https://kurevadigitaldata.manus.space",
  "https://kurevaweb-6ogx44kp.manus.space",
  "http://localhost:3000",
]);

function cors(request: Request) {
  const origin = request.headers.get("origin");
  return {
    "Access-Control-Allow-Origin": origin && allowedOrigins.has(origin) ? origin : "https://kurevadigitaldata.manus.space",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
    "Content-Type": "application/json; charset=utf-8",
  };
}

function reply(request: Request, body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: cors(request) });
}

function validEntrySource(value: unknown) {
  return value === "invitacion_directa" || value === "referido" || value === "directo";
}

async function insert(table: string, payload: Record<string, unknown>) {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) throw new Error("Configuración privada no disponible.");
  const response = await fetch(`${url}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const detail = await response.text();
    console.error(`Insert into ${table} failed`, response.status, detail);
    throw new Error("No se pudo guardar en el buzón privado.");
  }
}

function isClosed() {
  return Date.now() >= new Date(PILOT_CLOSES_AT).getTime();
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: cors(request) });
  if (request.method !== "POST") return reply(request, { error: "Método no permitido." }, 405);

  const origin = request.headers.get("origin");
  if (origin && !allowedOrigins.has(origin)) return reply(request, { error: "Origen no autorizado." }, 403);

  try {
    const body = await request.json() as { type?: string; payload?: unknown };
    if (!body.payload || typeof body.payload !== "object") return reply(request, { error: "Solicitud incompleta." }, 400);

    if (body.type === "feedback") {
      const item = body.payload as FeedbackPayload;
      if (!/^KUREVA-[A-Z0-9]{6}$/.test(item.ticket_code) || !Number.isInteger(item.rating) || item.rating < 1 || item.rating > 5 || typeof item.message !== "string" || item.message.trim().length < 10 || item.message.length > 700 || !validEntrySource(item.entry_source) || item.consent_privacy !== true) {
        return reply(request, { error: "Revisa los datos de la valoración." }, 400);
      }
      await insert("pilot_feedback", { ...item, message: item.message.trim(), sender_name: item.is_anonymous ? null : item.sender_name?.trim().slice(0, 80) || null });
      return reply(request, { ok: true, stored: "feedback" }, 201);
    }

    if (body.type === "interest") {
      const item = body.payload as InterestPayload;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.email) || !validEntrySource(item.entry_source) || item.consent_privacy !== true || item.consent_updates !== true) {
        return reply(request, { error: "Revisa el correo y tus consentimientos." }, 400);
      }
      await insert("pilot_interest", { ...item, email: item.email.trim().toLowerCase() });
      return reply(request, { ok: true, stored: "interest" }, 201);
    }

    if (body.type === "community") {
      if (isClosed()) return reply(request, { error: "La comunidad de prueba ya se ha cerrado. Gracias por participar." }, 410);
      const item = body.payload as CommunityPayload;
      if (typeof item.message !== "string" || item.message.trim().length < 10 || item.message.length > 500 || !item.consent_public || !item.category) {
        return reply(request, { error: "Revisa tu publicación antes de compartirla." }, 400);
      }
      await insert("pilot_community_messages", {
        ...item,
        display_name: item.is_anonymous ? "Persona Kureva" : item.display_name.trim().slice(0, 60),
        message: item.message.trim(),
        visible_until: PILOT_CLOSES_AT,
      });
      return reply(request, { ok: true, stored: "community", closes_at: PILOT_CLOSES_AT }, 201);
    }

    return reply(request, { error: "Tipo de solicitud no reconocido." }, 400);
  } catch (error) {
    console.error(error);
    return reply(request, { error: error instanceof Error ? error.message : "No se pudo completar la solicitud." }, 500);
  }
});
