#!/usr/bin/env bash
set -euo pipefail

API_URL="https://ikhvfugfmqulxbxrkdvl.supabase.co"
KEY="sb_publishable_uVi6uJwOgzHrbEg6AkgBTA_FhDWk358"
TICKET="KUREVA-VAL$(date +%s | tail -c 4)"

curl --fail-with-body -sS -o /tmp/kureva-feedback-response.txt -w '%{http_code}\n' \
  -X POST "$API_URL/rest/v1/pilot_feedback" \
  -H "apikey: $KEY" \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  --data "{\"ticket_code\":\"$TICKET\",\"experience_area\":\"kurevalife_simulator\",\"feedback_type\":\"observation\",\"feedback_category\":\"clarity\",\"rating\":5,\"message\":\"Validación técnica del envío anónimo de prueba de KurevaLife.\",\"accessibility_context\":\"not_shared\",\"is_anonymous\":true,\"sender_name\":null,\"consent_privacy\":true}"

curl --fail-with-body -sS -o /tmp/kureva-interest-response.txt -w '%{http_code}\n' \
  -X POST "$API_URL/rest/v1/pilot_interest" \
  -H "apikey: $KEY" \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  --data "{\"email\":\"validation+pilot@kureva.example\",\"participation_role\":\"otro\",\"consent_updates\":true,\"consent_kit_updates\":false,\"consent_privacy\":true}"
