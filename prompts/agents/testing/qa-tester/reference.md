# QA Tester reference

## Deployment URLs

| Environment | Frontend URL | Kafka topic prefix | Passwordless login topic |
|-------------|--------------|-------------------|--------------------------|
| Staging (default) | `https://<STAGING_FRONTEND_URL>/` | `<STAGING_ENV>` | `<STAGING_OTP_KAFKA_TOPIC>` |
| QA | `https://<QA_FRONTEND_URL>/` | `qa` | `<QA_OTP_KAFKA_TOPIC>` |
| Local | User-provided (e.g. `http://localhost:3000`) | Depends on local Kafka setup | Match `E2E_KAFKA_TOPIC_PREFIX` in `test/e2e/.env.e2e.local` |

**Monolith / redirection base URLs** (legacy flows, password login link):

| Environment | Monolith URL |
|-------------|--------------|
| Staging | `https://<STAGING_MONOLITH_URL>` |
| QA | `https://<QA_FRONTEND_URL>` |

Infer the environment from the user-provided frontend URL. When ambiguous, ask once.

**Monolith API base** (player registration): use the monolith URL from the table above — not the Next.js frontend URL. Matches `E2E_MONOLITH_URL` in `test/e2e/.env.e2e.local`.

## Player registration (API)

Register a **fresh player at the start of every QA test run** unless the ticket requires a specific existing account (named QA user, seeded data, feature-flagged player). It is faster than UI registration and returns `playerId` (from JWT, to filter OTP in Kafka/Aiven) and `email` (for the login form).

Reference: `test/e2e/interactions/steps/api/MonolithApi.ts` · `test/e2e/tests/player/login/login.uat.spec.ts`.

### Defaults (same as E2E `generateRandomPlayer`)

| Field | Value |
|-------|-------|
| `email` | `test-<random-hex>@test.com` |
| `mobilePhoneNumber` | `1234567890` |
| `countryCode` | `44` |
| `password` | `<TEST_PLAYER_PASSWORD>` |
| `firstname` / `lastname` | `John<random>` / `Doe<random>` |
| `birthdate` | `19900101` |
| `language` | `en_GB` |
| `country` | `GB` |
| `currency` | `GBP` |
| `salutation` | `MR` |
| `nationality` | `BRITISH` |
| Address | <TEST_STREET> 123, London, <TEST_POSTCODE> |
| `gdprChecked` | `true` |
| `limitAmount` / `limitPeriod` / `noLimit` | `200000` / `DAY` / `true` |

### Register via Shell (curl)

```bash
MONOLITH_URL="${MONOLITH_URL:-<MONOLITH_URL>}"   # from env / .env.local, e.g. https://<STAGING_MONOLITH_URL>
RANDOM_ID="$(openssl rand -hex 10)"
EMAIL="test-${RANDOM_ID}@test.com"

RESP=$(curl -sS -X POST "${MONOLITH_URL}/api/client/v1/players" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${MONOLITH_API_KEY:?set MONOLITH_API_KEY from env or .env.local}" \
  -d "{
    \"email\": \"${EMAIL}\",
    \"mobilePhoneNumber\": \"1234567890\",
    \"countryCode\": \"44\",
    \"password\": \"${TEST_PLAYER_PASSWORD:?set TEST_PLAYER_PASSWORD from env or .env.local}\",
    \"firstname\": \"John${RANDOM_ID:0:5}\",
    \"lastname\": \"Doe${RANDOM_ID:0:5}\",
    \"language\": \"en_GB\",
    \"country\": \"GB\",
    \"currency\": \"GBP\",
    \"birthdate\": \"19900101\",
    \"salutation\": \"MR\",
    \"nationality\": \"BRITISH\",
    \"streetName\": \"${TEST_STREET:-<TEST_STREET>}\",
    \"streetNr\": \"123\",
    \"city\": \"London\",
    \"postCode\": \"${TEST_POSTCODE:-<TEST_POSTCODE>}\",
    \"gdprChecked\": true,
    \"limitAmount\": \"200000\",
    \"limitPeriod\": \"DAY\",
    \"noLimit\": true
  }")

# Expect HTTP 200/201 — extract playerId from access_token JWT payload
PLAYER_ID=$(echo "$RESP" | python3 -c "
import sys, json, base64
body = json.load(sys.stdin)
token = body['access_token']
payload = json.loads(base64.urlsafe_b64decode(token.split('.')[1] + '=='))
print(payload['playerId'])
")

echo "email=$EMAIL"
echo "playerId=$PLAYER_ID"
```

Save `{ email, playerId }` for the run. Optionally save redacted JSON to evidence as `player-registration.json`. Do **not** commit or echo `access_token`.

### Optional post-registration setup

Some flows need extra API steps after registration (only when the ticket requires it):

| Need | E2E reference | Endpoint |
|------|---------------|----------|
| KYC / age verified | `registration.uat.spec.ts` | `PUT …/lotto-third-party-stubs/api/players/vstate-with-reason` |
| Deposit balance | `MonolithApi.deposit` | `POST …/api/payment/lottopay/charge` |

Do not call these unless the ticket or ACs require that state.

## OTP retrieval (passwordless login)

Use this priority chain. Stop at the first method that works.

| Priority | Method | When to use |
|----------|--------|-------------|
| 1 | `user-aiven` MCP | MCP healthy and org allows MCP connections |
| 2 | **Direct Aiven API** (Shell + curl) | MCP blocked, errored, or unauthenticated — **default fallback for Lottoland** |
| 3 | [Aiven Console](https://console.aiven.io) (account `<AIVEN_ACCOUNT_ID>`, project `<AIVEN_PROJECT>`, service `<AIVEN_SERVICE>`) | API token unavailable or message read fails twice |
| 4 | User paste | Ask the user to paste the latest Kafka message JSON |

### Known org restriction

Lottoland's Aiven org may return **403 — "MCP connections are disabled by your organization administrator"** when calling tools through `mcp-aiven`, even with a valid token. The **direct Aiven REST API still works** with the same personal token. Always fall back to the API steps below when MCP returns that error.

### Aiven constants (<AIVEN_PROJECT>)

| Constant | Value |
|----------|-------|
| Project | `<AIVEN_PROJECT>` |
| Kafka service | `<AIVEN_SERVICE>` |
| API base | `https://api.aiven.io/v1` |
| Token | Read from `~/.cursor/mcp.json` → `mcpServers.aiven.env.AIVEN_TOKEN` or `.env.local`. Never commit or echo the token. |
| Account / project / service / topic | Resolve `<AIVEN_ACCOUNT_ID>`, `<AIVEN_PROJECT>`, `<AIVEN_SERVICE>`, and OTP topic names from env or `.env.local` — never hardcode company values. |

### Direct API workflow (preferred fallback)

**Always use `format: "binary"`** (`format: "json"` often returns 422 on this cluster). The OTP to type is the **`code`** field from the decoded payload — nothing else. Capture offsets **before** submitting email, consume **after** submit (same idea as `test/e2e/interactions/steps/player/kafka/KafkaStep.ts`).

**One-shot script** — get the OTP `code` for a known `playerId` (from API registration):

```bash
# Do not print the token in chat or logs
TOKEN="$(python3 -c "import json; print(json.load(open('$HOME/.cursor/mcp.json'))['mcpServers']['aiven']['env']['AIVEN_TOKEN'])")"
: "${AIVEN_PROJECT:?set AIVEN_PROJECT from env or .env.local}"
: "${AIVEN_SERVICE:?set AIVEN_SERVICE from env or .env.local}"
TOPIC="${TOPIC:-<TOPIC_NAME>}"        # e.g. <STAGING_OTP_KAFKA_TOPIC> from env
PLAYER_ID="<PLAYER_ID>"     # from registration API — required when filtering OTP
BASELINE="${1:-}"           # offset captured before login submit

LATEST=$(curl -sS -H "Authorization: Bearer $TOKEN" \
  "https://api.aiven.io/v1/project/${AIVEN_PROJECT}/service/${AIVEN_SERVICE}/topic/$TOPIC" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['topic']['partitions'][0]['latest_offset'])")

OFFSET="${BASELINE:-$((LATEST - 1))}"

curl -sS -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  "https://api.aiven.io/v1/project/${AIVEN_PROJECT}/service/${AIVEN_SERVICE}/kafka/rest/topics/$TOPIC/messages" \
  -d "{\"format\":\"binary\",\"partitions\":{\"0\":{\"offset\":$OFFSET}},\"timeout\":20000,\"max_bytes\":65536}" \
  | python3 -c "
import sys, json, base64, os
player_id = os.environ.get('PLAYER_ID') or '$PLAYER_ID'
d = json.load(sys.stdin)
msgs = d.get('messages', [])
for m in msgs:
    payload = json.loads(base64.b64decode(m['value']))
    if player_id and payload.get('playerId') != player_id:
        continue
    print(payload['code'])
    break
else:
    raise SystemExit('No OTP for playerId')
"
```

- **Login flow:** capture baseline offset **before** email submit → submit registered player's **email** → run script with `BASELINE` and `PLAYER_ID` → use printed **`code`**.
- When `PLAYER_ID` is known (always, after API registration), **always filter by it** — do not use the latest message blindly.
- If empty, retry once after 3–5 s. If still empty, switch to the console and filter by `playerId` there.

**MCP equivalent** (when MCP works): `aiven_kafka_topic_message_list` with `format: "binary"`, decode base64 `value`, use **`code`**.

Requires `kafka_rest: true` on the service (already enabled on `<AIVEN_SERVICE>`).

### Aiven Console links

Open [Aiven Console](https://console.aiven.io) and navigate with placeholders from env / `.env.local` (never commit real ids):

- Account `<AIVEN_ACCOUNT_ID>` → project `<AIVEN_PROJECT>` → service `<AIVEN_SERVICE>` → topics
- Staging OTP topic: `<STAGING_OTP_KAFKA_TOPIC>`
- QA OTP topic: `<QA_OTP_KAFKA_TOPIC>`

Save a redacted copy of the OTP message JSON as evidence: `kafka-otp-<slug>.json`.

### OTP message shape

Payload (after base64-decoding `messages[].value`):

```json
{
  "playerId": "<uuid>",
  "code": "<6-digit OTP>",
  "channel": "EMAIL"
}
```

**Use only `code` for the OTP input.** `channel` may be `"SMS"` when the user switches channel during login.

**Matching strategy:**

1. Register player via API → keep `playerId` and `email`.
2. Capture baseline offset **before** submitting that email on the login form.
3. Read messages **after** submit; pick the message where `playerId` matches.
4. Use **`code`** from that message only.

## Passwordless login flow (browser)

Mobile viewport first: **390×844**.

| Step | Action | Selector / hint |
|------|--------|-----------------|
| 1 | Open login | Mobile: header login button. Desktop: desktop login button. Form visible: `data-testid="email-phone-form"` |
| 2 | Enter email or phone | `data-testid="email-phone-contact-input"` textbox |
| 3 | Continue | `data-testid="email-phone-submit"` |
| 4 | Wait for OTP form | `data-testid="otp-form"` visible |
| 5 | Fetch OTP | Aiven topic → decode → use **`code`** |
| 6 | Enter OTP | `data-testid="otp-input"` — paste **`code`** |
| 7 | Submit | `data-testid="otp-submit"` |
| 8 | Assert logged in | Avatar button in header; OTP form hidden |

Optional OTP actions (only when the test plan requires them):

- Resend: `data-testid="otp-resend-code"` (30s cooldown)
- Switch channel: `data-testid="otp-channel-switch"`
- Password login fallback: `data-testid="otp-need-help-link"`

Reference implementation: `test/e2e/tests/player/login/login.uat.spec.ts`.

## E2E selectors cheat sheet

Prefer `data-testid` attributes from `test/e2e/interactions/pages/`. Use `browser_snapshot` to discover refs when test ids are missing.

## Evidence storage

Save artefacts under:

```text
.agents/skills/testing/qa-tester/evidence/<CHR-XXXX>/
```

### Priority

1. **Video + screenshots** — single `run-qa-plan.sh` pass (preferred)
2. **MCP screenshots** — supplement when runner fails or for exploratory gaps

**Local first:** the runner and MCP always write to `evidence/<CHR-XXXX>/`. Jira upload (`upload-jira-evidence.sh`) sends a **copy** — it does not remove or replace local files.

Never reference local paths in Jira comments. Upload files to the ticket in addition to keeping them locally.

### Naming convention

```text
qa-plan.json                 # generic run plan (agent writes per ticket)
qa-results.json              # runner output — per-scenario pass/fail
<chr-xxxx>-evidence.webm     # full run video
expected/                    # expected-result screenshots from Jira (reference only)
expected/ac1-<slug>.png
ac1-<short-slug>.png         # actual evidence from the run
ac2-<short-slug>.png
fail-<scenario-id>.png       # auto-captured on scenario failure
api-<endpoint-slug>.json     # optional
```

## Expected-result screenshots from Jira

Tickets often embed **screenshots of the expected UI** in the description (e.g. *Screenshot/Video attached*, inline images under an AC, design mocks). Treat them as part of the acceptance criteria alongside the written text.

### Phase 0 — ingest

1. Scan description and QA-relevant comments for images, attachment links, and Figma URLs.
2. Map each visual to an AC or manual scenario (e.g. "description image under AC1 → focus on month field after DD=15").
3. Download when possible into `evidence/<CHR-XXXX>/expected/`:
   - Jira issue attachments: `GET /rest/api/3/issue/CHR-XXXX?fields=attachment` then `GET /rest/api/3/attachment/content/{id}` (same credentials as [Jira evidence upload](#jira-evidence-upload)).
   - Inline description images may need opening the ticket in browser or `fetch` MCP if markdown returns a reachable URL.
4. If an image cannot be downloaded, note it in the dossier and describe what it shows from the ticket context.

### Phase 1–2 — use

- Test plan **Expected** column + **Visual ref** must reflect both AC text and the screenshot.
- During execution, compare actual `ac*.png` against `expected/ac*.png` (focus, field values, visible labels, spacing).
- Mismatches → ❌ even when programmatic asserts pass, unless the screenshot is clearly outdated (say so in the report).

Do not upload `expected/` files to Jira — they are reference copies from the ticket, not run evidence.

Do not commit evidence folders. They are run artefacts only.

## Generic Playwright runner (primary)

Execution is **one pass**: test + video + screenshots via [scripts/run-qa-plan.mjs](scripts/run-qa-plan.mjs) and a JSON plan. Full schema: [scripts/qa-plan.schema.md](scripts/qa-plan.schema.md). Skeleton: [scripts/qa-plan.template.json](scripts/qa-plan.template.json).

### Workflow

1. After Phase 1 approval, write `evidence/<CHR-XXXX>/qa-plan.json` from the approved plan (the only per-ticket artefact — never copy `run-qa-plan.mjs` into evidence).
2. Inject `variables` (`testEmail`, `otpCode`, etc.) from API registration / Kafka when needed.
3. Run:

```bash
.agents/skills/testing/qa-tester/scripts/run-qa-plan.sh \
  .agents/skills/testing/qa-tester/evidence/CHR-XXXX/qa-plan.json
```

4. Read `qa-results.json`. Exit `0` = all scenarios passed; `1` = failures (video still recorded).

`run-qa-plan.sh` uses `test/e2e` Playwright when installed, otherwise a temp cache under `$TMPDIR/qa-tester-playwright`.

### MCP fallback (exploratory)

Use `cursor-ide-browser` (or `user-playwright` MCP) **only when**:

- `run-qa-plan.sh` exits non-zero — complete or re-check failed scenarios;
- selectors are unknown — discover `data-testid` via snapshot, update plan, re-run;
- exploratory debugging — unexpected UI, blockers, OTP issues.

Do **not** use MCP as the primary execution path when the plan can be expressed in `qa-plan.json`.

## Jira evidence upload

Upload attachments **before** posting the QA report comment. Requires `JIRA_USERNAME` + `JIRA_API_TOKEN` in `~/.cursor/mcp.json` → `mcpServers.atlassian.env` (same credentials as the Atlassian MCP REST fallback).

### Helper script

```bash
chmod +x .agents/skills/testing/qa-tester/scripts/upload-jira-evidence.sh

# Default — video + screenshots
.agents/skills/testing/qa-tester/scripts/upload-jira-evidence.sh CHR-XXXX \
  .agents/skills/testing/qa-tester/evidence/CHR-XXXX/ --all

# Screenshots only (--no-jira-video flag)
.agents/skills/testing/qa-tester/scripts/upload-jira-evidence.sh CHR-XXXX \
  .agents/skills/testing/qa-tester/evidence/CHR-XXXX/ --screenshots
```

### Manual curl (one file)

```bash
JIRA_URL="${JIRA_URL:-https://<JIRA_HOST>}"   # from env, .env.local, or ~/.cursor/mcp.json
# Read JIRA_USERNAME + JIRA_API_TOKEN from ~/.cursor/mcp.json — never echo the token

curl -sS -u "${JIRA_USERNAME}:${JIRA_API_TOKEN}" \
  -H "X-Atlassian-Token: no-check" \
  -F "file=@.agents/skills/testing/qa-tester/evidence/CHR-XXXX/chr-xxxx-evidence.webm" \
  "${JIRA_URL}/rest/api/3/issue/CHR-XXXX/attachments"
```

Repeat for each `ac*.png`. Attachments appear on the Jira issue; the report comment references them with **Attachments:** (never local repo paths).

### Flags

| Flag | Jira upload |
|------|-------------|
| *(default)* | Video + screenshots |
| `--no-jira-video` | Screenshots only |
| `--no-jira-evidence` | Skip all uploads; mention in chat only |

## Jira custom fields

| Field | Purpose |
|-------|---------|
| `customfield_11201` | Linked GitLab MR URL → extract `iid` for optional MR context |

Cloud ID: try `<JIRA_HOST>` from env / `~/.cursor/mcp.json` (`JIRA_URL` host) first.
