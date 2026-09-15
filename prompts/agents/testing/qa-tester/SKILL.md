---
name: qa-tester
description: >-
  Manual QA execution for lottoland-fe CHR tickets. Reads the full Jira ticket
  (ACs verbatim, expected-result screenshots, Testing Strategy, comments, preconditions) before any browser
  action, builds an approved test plan, writes a generic qa-plan.json, executes via the Playwright runner (video + screenshots + assertions in one pass), falls back to browser MCP for exploratory or failed scenarios, uploads evidence to Jira, and posts a QA Testing report. Not qa-feedback — that skill reviews MR code and test coverage without opening a browser. Invoke with "qa tester", "qa test CHR-XXXX", "run qa tests CHR-XXXX", or a CHR Jira URL. User must provide the deployment URL. Optional flags: `--no-jira-video`, `--no-jira-evidence`.
disable-model-invocation: true
---

# QA Tester (lottoland-fe)

> **Role:** you are a **manual QA tester**. Read the CHR ticket thoroughly first — every AC, the Testing Strategy (Manual / UAT / E2E), preconditions, QA-relevant comments — then build a test plan, get approval, and **only then** drive the deployed app with Playwright.
>
> **Sibling skills:** `qa-test-strategy` plans automated layers; `qa-feedback` gives early desk-side feedback from the MR (no browser); **this skill** is the hands-on manual run on a live environment.

## Skill split — qa-tester vs qa-feedback

| | **qa-tester** (this skill) | **qa-feedback** |
|---|------------------------------|-----------------|
| **When** | Feature deployed — manual sign-off | MR open — early review before merge |
| **Focus** | Execute manual scenarios, observe the product | Review code, specs, coverage gaps |
| **Playwright** | **Yes** — generic `run-qa-plan.mjs` (primary); browser MCP (fallback) | **Never** |
| **Evidence** | Video + screenshots uploaded to Jira (local copy in `evidence/<CHR-XXXX>/`) | None — citations to spec files |
| **Verdict source** | What you see in the UI | What the MR diff and tests contain |

If the user wants feedback on missing unit tests or diff coverage, redirect to **`qa-feedback`**.

## What this skill is NOT

- **Not** `pnpm test` or CI Playwright suites. Playwright here = **generic `qa-plan.json` runner** (+ browser MCP fallback), not running `*.spec.*` files.
- **Not** early MR review (that is `qa-feedback`). Read MR/E2E specs only to learn routes and selectors.
- **Not** an edge-case hunt. Stick to ACs and realistic flows from the ticket's Manual / UAT sections.
- **Not** a description editor. Never call `editJiraIssue`.

If the user only wants a test plan, produce Phases 0–1 and stop. For a Testing Strategy on the description, redirect to `qa-test-strategy`.

---

## Flags (optional)

Pass in the **same chat message** as the ticket. Read once; do not ask again.

| Flag | Effect |
|------|--------|
| `--no-jira-video` | Upload per-AC screenshots to Jira; **do not** upload the evidence video |
| `--no-jira-evidence` | Do **not** upload video or screenshots to Jira (local evidence only; note in chat) |

Examples: `qa tester CHR-1289 on staging` · `qa test CHR-1289 --no-jira-video` · `run qa tests CHR-1289 --no-jira-evidence`

Default (no flags): upload **video + all per-AC screenshots** to the Jira ticket before posting the report comment.

---

## Caveman lifecycle (mandatory, saves tokens)

This skill uses **caveman** mode for every intermediate message and **exits caveman** for the final report.

- **Enable** in your **first reply**, before any tool call. Read `.agents/skills/caveman/SKILL.md` once and apply it to: Phase 0 dossier + ingest notes, Phase 1 plan reasoning, Phase 2 execution progress, Phase 3 evidence notes, and any blocker question.
- **Disable before** the Phase 4 final delivery — the test plan preview, the QA report, and the Jira comment body are all **plain English, never caveman**.
- **Override:** `stop caveman` / `normal mode` / `verbose` → exit immediately for the rest of the run.

---

## Hard rules

1. **Read the ticket before any browser action.** Phases 0–1 are mandatory. Never run `run-qa-plan.sh`, browser MCP, or player registration until you have (a) ingested the full ticket, (b) shown the dossier, (c) built the plan, (d) got user approval (or explicit "go" / "execute" / "run"). If the user skips ahead, still complete Phase 0–1 first.
2. **Every AC exercised** in the browser (or marked `Blocked` with reason). Record an evidence **video** of the full run when possible; capture ≥1 **screenshot per AC** as fallback or supplement.
3. **Real user flows only.** Happy paths and main variations from Manual / E2E. No exhaustive edge matrices.
4. **Mobile first.** Default viewport **390×844**. Add desktop only when the ticket requires different desktop behaviour.
5. **User provides the URL.** Never assume an environment — stop and ask if missing.
6. **English only** inside the Jira comment body.
7. **No AI signature** ("by Minerva", "AI agent", etc.).
8. **Evidence mandatory.** Prefer one run video (`<chr-xxxx>-evidence.webm`) plus ≥1 screenshot per AC under `evidence/<CHR-XXXX>/` (see [reference.md](reference.md)). Upload to Jira unless `--no-jira-evidence` or `--no-jira-video` applies.
9. **Local evidence always kept.** All artefacts are written under `evidence/<CHR-XXXX>/` first. Jira upload is an **additional copy** — never delete or skip local files after upload.
10. **Jira evidence policy:** upload attachments **before** the report comment. Never put local repo paths in the Jira comment — attachments speak for themselves. If upload fails, say so in chat and list filenames; do not reference `.agents/...` paths on Jira.
11. **Jira posting policy:** all ACs pass → post the report automatically (after a chat preview); any failure → show the full report in chat first, post **only when the user asks**.
12. **One ticket → one comment** per run.
13. **No code changes.** Do not edit source, tests, or configs (`qa-plan.json` and evidence under `evidence/<CHR-XXXX>/` are run artefacts, not repo changes).
14. **Fresh player per run** via the monolith API (unless the ticket mandates a specific account). Use the returned `email` for login and `playerId` to filter OTP.
15. **Test what the ticket says.** Each scenario traces to a numbered AC or a Manual / UAT / E2E / QA checklist bullet. Do not invent scenarios.
16. **Expected-result screenshots are authoritative** when the ticket includes them. Ingest in Phase 0, save to `evidence/<CHR-XXXX>/expected/`, and compare actual UI against them during sign-off — not only the written AC text.

---

## Tools (MCPs)

| Source | Tool | Purpose |
|--------|------|---------|
| `user-atlassian` | `getJiraIssue` | Full ticket read — description, ACs, Testing Strategy, comments |
| `user-atlassian` | `addCommentToJiraIssue` | Post QA Testing report |
| Shell | `scripts/run-qa-plan.sh` | **Primary** — run `qa-plan.json` (video + screenshots + asserts) |
| `cursor-ide-browser` | Browser tools | **Fallback** — exploratory QA, failed scenarios, unknown selectors |
| `user-playwright` | Browser tools | **Fallback** when `cursor-ide-browser` unavailable |
| `user-aiven` | Kafka / topic tools | Read OTP — try first |
| Shell | `curl` + monolith API | **Register player** at run start |
| Shell | `curl` + Aiven REST API | **OTP fallback** — filter by `playerId` |
| Shell | `scripts/upload-jira-evidence.sh` | **Upload video/screenshots** to Jira |
| Workspace | `Read`, `Grep`, `Glob` | MR context, routes, E2E selectors |

### Generic Playwright runner (primary)

After Phase 1 approval, copy [scripts/qa-plan.template.json](scripts/qa-plan.template.json) → `evidence/<CHR-XXXX>/qa-plan.json` and fill from the approved plan. Schema: [scripts/qa-plan.schema.md](scripts/qa-plan.schema.md).

```bash
.agents/skills/testing/qa-tester/scripts/run-qa-plan.sh \
  .agents/skills/testing/qa-tester/evidence/CHR-XXXX/qa-plan.json
```

One pass produces: `<chr-xxxx>-evidence.webm`, per-AC screenshots, `qa-results.json`. Use `type` + `pause` steps so focus changes are visible in the video. Inject `variables` (`testEmail`, `otpCode`, …) from API registration / Kafka.

### Browser MCP — fallback (exploratory)

Use **only when** the runner fails, selectors are unknown, or exploratory investigation is needed:

| Situation | Action |
|-----------|--------|
| `run-qa-plan.sh` exit `1` | Read `qa-results.json` → MCP re-check failed scenarios |
| Missing `data-testid` | `browser_snapshot` → update `qa-plan.json` → re-run |
| Blocker (OTP, flags, env) | MCP diagnose; mark `Blocked` if unrecoverable |

| Intent | `cursor-ide-browser` | `user-playwright` fallback |
|--------|----------------------|----------------------------|
| Open URL | `browser_navigate` | navigate |
| Inspect page | `browser_snapshot` | snapshot |
| Click | `browser_click` | click |
| Type / fill | `browser_fill` / `browser_type` | fill / type |
| Screenshot | `browser_take_screenshot` | screenshot |

With `cursor-ide-browser`, lock/unlock around long sequences. MCP screenshots supplement the plan when the runner could not complete a scenario.

### Jira evidence upload

Upload **before** `addCommentToJiraIssue`. Use [scripts/upload-jira-evidence.sh](scripts/upload-jira-evidence.sh) or equivalent `curl` (details in [reference.md](reference.md#jira-evidence-upload)).

| Flag | Upload |
|------|--------|
| *(default)* | Video + all `ac*.png` / `scenario-*.png` |
| `--no-jira-video` | Screenshots only |
| `--no-jira-evidence` | Nothing — local files only |

Requires `JIRA_USERNAME` + `JIRA_API_TOKEN` in `~/.cursor/mcp.json` → `mcpServers.atlassian.env`. If upload fails, report in chat; never paste local paths into the Jira comment.

### Atlassian MCP

Resolve `<JIRA_HOST>`, monolith URL, `<MONOLITH_API_KEY>`, and Kafka topic names from env, `.env.local`, or `~/.cursor/mcp.json`. Never hardcode company hosts, API keys, or topics.

```text
getJiraIssue:
  cloudId: "<JIRA_HOST>"   issueIdOrKey: "CHR-XXXX"
  fields: ["summary","description","status","assignee","customfield_11201","comment"]
  responseContentFormat: "markdown"

addCommentToJiraIssue:
  cloudId: "<JIRA_HOST>"   issueIdOrKey: "CHR-XXXX"
  commentBody: <markdown QA Testing report>   contentFormat: "markdown"
```

### Aiven / Kafka (passwordless OTP)

Full retrieval chain (MCP → direct API → console → user paste) is in [reference.md](reference.md). Topics: Staging `<STAGING_OTP_KAFKA_TOPIC>`, QA `<QA_OTP_KAFKA_TOPIC>` (from env / `.env.local`).

Priority: (1) `user-aiven` MCP (`aiven_kafka_topic_get` → `aiven_kafka_topic_message_list`); (2) direct Aiven API via Shell on 403 *"MCP connections are disabled"* or any MCP error (`format: "binary"`, decode base64 `value`, take **`code`**); (3) Aiven Console; (4) user paste.

Filter by registered **`playerId`**. The login OTP is always `payload.code`. Never print the token. Save redacted Kafka JSON as optional evidence (`kafka-otp-<slug>.json`).

### Player registration (start of every run)

Register via the monolith API (same as E2E `setup.api.monolith.registerPlayer()`); full payload/curl in [reference.md](reference.md#player-registration-api):

1. Derive the **monolith URL** from the deployment environment (not the frontend URL).
2. `POST {monolith}/api/client/v1/players` with `X-API-Key: <MONOLITH_API_KEY>` (value from env / `.env.local`; never commit or echo the key).
3. Decode **`playerId`** from the `access_token` JWT (`payload.playerId`).
4. Keep **`email`** + **`playerId`** for the whole run.

Skip only when the ticket requires a named/seeded account.

---

## Output templates

### Test plan (Phase 1 — chat)

```text
### QA Test Plan — CHR-XXXX

**Environment:** <url>   **Monolith:** <monolith-url>
**Test player:** <email> · playerId `<id>`   **Viewport:** 390×844 (mobile)
**Preconditions:** <flags, starting route>

| # | Scenario | Source | Expected (from ticket) | Visual ref | Steps (summary) |
|---|----------|--------|------------------------|------------|-----------------|
| 1 | <title> | AC1 | <what AC1 says should happen> | <expected/ac1.png or "none"> | <3–5 steps> |
| 2 | <title> | AC2 | <what AC2 says should happen> | <expected/ac2.png or "none"> | <3–5 steps> |
```

When the ticket includes expected-result screenshots, the **Expected** column must describe what the image shows (focus state, labels, layout) — not only the AC text.

### Jira comment — all passed

```text
### QA Testing Report

**Environment:** <url>   **Date:** <YYYY-MM-DD>   **Result:** ✅ All ACs passed

| AC | Scenario | Result |
|----|----------|--------|
| AC1 — <short title> | <what was tested> | ✅ |
| AC2 — <short title> | <what was tested> | ✅ |

**Attachments:** evidence video and per-AC screenshots uploaded to this ticket.
```

Keep one line per AC. No long prose when everything passes. Omit the **Attachments** line when `--no-jira-evidence` was used. When `--no-jira-video`, write: `**Attachments:** per-AC screenshots uploaded to this ticket.`

### Jira comment — failures (only when user asks to post)

```text
### QA Testing Report

**Environment:** <url>   **Date:** <YYYY-MM-DD>   **Result:** ❌ Failures found

| AC | Scenario | Result | Details |
|----|----------|--------|---------|
| AC1 — <title> | <scenario> | ✅ | — |
| AC2 — <title> | <scenario> | ❌ | <expected vs observed, steps to reproduce> |

**Attachments:** evidence video and per-AC screenshots uploaded to this ticket.
```

For failures, **Details** must give: expected behaviour, actual behaviour, URL/route, last action before failure. Upload evidence before posting (same flag rules as pass report).

---

## Workflow

Five phases. Stop only at explicit stop gates. Caveman ON for Phases 0–3, OFF for Phase 4.

### Phase 0 — Read and analyse ticket (mandatory before browser)

**Do not open Playwright or register a player here.** Only goal: understand the ticket completely.

1. Resolve `cloudId` (`<JIRA_HOST>` from env / `~/.cursor/mcp.json`).
2. **`getJiraIssue`** with all fields above. Read the **full** description and keep:
   - **Summary**, **Context/background** (scope, user story, design links).
   - **Numbered ACs** — copy each **verbatim** and count them.
   - **Expected-result visuals** — screenshots, videos, or mockups embedded in the description or comments (sections like *Screenshot/Video attached*, inline images, Figma links). Map each image to the AC or scenario it illustrates. See [reference.md](reference.md#expected-result-screenshots-from-jira).
   - **Testing Strategy panel** — Manual / Exploratory, UAT, E2E journeys, QA checklist, Out of scope / N/A.
   - **Preconditions** — env hints, feature flags, routes, seeded data, accounts, KYC/deposit state, market/locale.
   - **`customfield_11201`** — MR link → read changed E2E specs/components **only** to learn how to reach the feature.
   - **Comments** — clarifications, env URLs, known bugs, scope changes overriding the description.
3. **Ambiguities:** list open questions in the dossier; ask before Phase 2 unless answered in comments.
4. Show the **ticket dossier** in chat (complete):

   ```text
   ### Ticket dossier — CHR-XXXX
   **Summary:** <title>   **Status:** <status>
   **Scope:** <1–2 lines>
   **Acceptance criteria (verbatim):** 1. … / 2. … / …
   **Testing Strategy — manual QA:** Manual · UAT · E2E journeys · QA checklist · Out of scope (bullets or "none documented")
   **Preconditions:** <flags, routes, account type, player state, locale>
   **MR / routes (if known):** <MR iid, key paths>
   **Expected-result visuals:** <AC → image/file · what it shows · saved to expected/ or "not downloadable">
   **Relevant comments / Open questions:** <bullets or "none">
   ```

5. **Ingest checklist** (confirm before leaving Phase 0): every AC copied verbatim & counted · expected-result screenshots/images identified and mapped to ACs · Manual/UAT/E2E/QA checklist read · preconditions & flags noted · comments scanned · open questions listed.
6. **Stop gate:** ask for the **deployment URL** (required), answers to open questions, feature-flag/data setup not inferable, and a specific existing account only when required. Do not proceed without the URL. Do not ask for a test account by default — registration creates one.

### Phase 1 — Build test plan (mandatory before browser)

Base the plan **only** on Phase 0. Every row cites its source (`AC1`, `Manual bullet 2`, `UAT — …`).

1. Map **every AC** to ≥1 scenario.
2. Add scenarios from Manual / UAT / E2E / QA checklist bullets not already covered (real-user flows only).
3. Write **expected result** from the ticket text **and** any mapped expected-result screenshot for each scenario (layout, focus, copy, element state).
4. Order by dependency (login first, then feature navigation).
5. Include per-scenario preconditions (logged-in state, route, data).
6. Present the **Test plan** template.
7. Note that execution will use a **`qa-plan.json`** derived from this plan (no per-ticket JavaScript).
8. **Stop gate:** wait for approval/adjustments. On "go" / "execute" / "run", proceed. **Never skip this gate**, even when the URL was in the invocation.

### Phase 2 — Execute (Playwright primary)

**Prerequisite:** Phase 0 dossier + Phase 1 approved plan shown. Otherwise go back.

**Run setup (once):** register player via monolith API when the plan needs login → store `email`, `playerId` → show `Player: <email> · playerId <id>`. Fetch OTP into `variables.otpCode` when the plan includes passwordless login (Kafka flow in [reference.md](reference.md)).

1. Copy [scripts/qa-plan.template.json](scripts/qa-plan.template.json) to `evidence/<CHR-XXXX>/qa-plan.json` — map every approved scenario to `scenarios[]`, fill `beforeAll` for shared navigation/login. Use `data-testid` from E2E specs. See [scripts/qa-plan.schema.md](scripts/qa-plan.schema.md).
2. Run `scripts/run-qa-plan.sh evidence/<CHR-XXXX>/qa-plan.json`.
3. Read `evidence/<CHR-XXXX>/qa-results.json` and summarise in chat:

```text
Runner — AC1 ✅ · AC2 ✅ · AC3 ❌  (video: chr-1289-evidence.webm)
```

4. **Visual check:** when `evidence/<CHR-XXXX>/expected/` has screenshots, compare each `ac*.png` against the matching expected image (focus field, visible copy, layout). Text-only ACs still rely on assertions in `qa-plan.json`.
5. **If all scenarios passed** → go to Phase 3.
6. **If any failed** → MCP fallback for failed `id`s only (exploratory re-check, extra screenshots). Update results table with runner + MCP findings. Optionally fix `qa-plan.json` and re-run once before accepting MCP-only evidence for a scenario.

Optional evidence: network snippets, Kafka JSON, console errors as `.json`.

### Phase 3 — Verify evidence

Confirm under `evidence/<CHR-XXXX>/`:

- `<chr-xxxx>-evidence.webm` exists (unless Playwright totally unavailable — then MCP screenshots only + note in report)
- ≥1 screenshot per AC (`ac*.png` or MCP supplement)
- `qa-results.json` matches the report table

Retry a missing screenshot once via MCP if the runner did not produce it.

### Phase 4 — Report

**Exit caveman.** Write the report and Jira body in plain English.

1. Build the report table from results and show it in chat (always).
2. **Upload evidence to Jira** (unless `--no-jira-evidence`): run `scripts/upload-jira-evidence.sh <CHR-XXXX> evidence/<CHR-XXXX>/ --all` or `--screenshots` when `--no-jira-video`. Confirm uploads succeeded.
3. **All ACs passed:** show the Jira comment preview (no local paths), then `addCommentToJiraIssue` without further confirmation (unless the user said "don't post").
4. **Any AC failed:** show the detailed failure report in chat; post to Jira **only** if the user explicitly asks (still upload evidence first unless `--no-jira-evidence`).
5. Summarise: pass/fail counts, what was uploaded to Jira (video and/or screenshots), whether the comment was posted.

---

## Decision rules

### What to test

| Include | Exclude |
|---------|---------|
| Every AC | Edge cases, boundary values, error matrices |
| Manual / E2E bullets from Testing Strategy | Scenarios already marked N/A |
| Main happy path + one realistic variation when the AC implies it | Duplicate scenarios across ACs |
| Login-gated flows with passwordless OTP | Automated pact/unit coverage |

### When to mark `Blocked` (not ❌)

Deployment URL unreachable · test account unavailable and registration out of scope · Kafka OTP unretrievable after two attempts · feature flag or backend dependency missing. Explain the blocker and what unblocks it.

### Environment inference

| URL contains | Kafka topic |
|--------------|-------------|
| `<STAGING_FRONTEND_SLUG>` or `<STAGING_ENV>` | `<STAGING_OTP_KAFKA_TOPIC>` |
| `<QA_ENV>` | `<QA_OTP_KAFKA_TOPIC>` |
| Other | Ask the user which topic to use |

---

## Examples

**Invocation:** `qa tester CHR-1234 on https://<STAGING_FRONTEND_URL>/`

**Login + feature test (condensed):** register player via API → `qa-plan.json` with `variables.email` + `variables.otpCode` → `run-qa-plan.sh` → video + `ac1-<slug>.png`. On failure → MCP fallback.

## Additional resources

- Environments, player registration, Kafka OTP: [reference.md](reference.md)
- `qa-plan.json` schema: [scripts/qa-plan.schema.md](scripts/qa-plan.schema.md)
- Plan template: [scripts/qa-plan.template.json](scripts/qa-plan.template.json)
- E2E registration API: `test/e2e/interactions/steps/api/MonolithApi.ts`
- E2E login + Kafka filter: `test/e2e/tests/player/login/login.uat.spec.ts`
