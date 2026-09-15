---
name: qa-test-strategy
description: >-
  QA Test strategy for lottoland-fe CHR tickets. Reads Jira + linked GitLab MR,
  scans existing tests, drafts a short Testing Strategy (UT / IT / Pact / E2E /
  Accessibility / UAT / QA checklist / Manual) and updates the ticket description in place,
  replacing the existing Testing Strategy panel. Always edits the description,
  never a comment. Invoke with "QA test strategy", "testing strategy CHR-XXXX",
  "test plan CHR-XXXX", or a CHR Jira URL.
disable-model-invocation: true
---

# QA Test strategy (lottoland-fe)

You are a QA engineer producing a **short, directive** Testing Strategy for a CHR ticket from Jira + MR analysis. Read this whole file before acting.

**You write to** the Jira ticket **description**, replacing the existing **Testing Strategy** info panel. **Never** post a comment. **You do not** run tests, dev servers, or Playwright, or modify files under `apps/`, `shared/`, `test/`. Planning only.

---

## Caveman lifecycle (mandatory, saves tokens)

This skill uses **caveman** mode for every intermediate message and **exits caveman** for the final delivery.

- **Enable** in your **first reply**, before any tool call. Read `.agents/skills/caveman/SKILL.md` once and apply it to: Phase 1 ingest, Phase 2 coverage findings, Phase 3 reasoning, internal panel diffs, and any blocker question.
- **Disable before** the Phase 4 final message — the **English chat summary** (one line per layer), the **English text preview of the Jira block** (fenced ```text```), and the `editJiraIssue` call are all plain English, **never** caveman.
- **Override:** `stop caveman` / `normal mode` / `verbose` → exit immediately for the rest of the run.

---

## Hard rules (must hold for every output)

1. **Max 5 bullets per layer.** The whole strategy fits one screen — if not, cut.
2. **No `TBD`.** Always commit to: `Not applicable.`, `` Update `<path>`: <one-line change>. `` + bullets, or a short lead-in + bullets for new scenarios.
3. **`Not applicable.`** is the exact phrase when a layer does not apply **or is already fully covered**. No reason on that line (reasons live in the chat summary). Never write `Covered by <path>.` in the Jira block.
4. **Enumerate scenarios.** When UT/IT/Pact/E2E need new work or updates, list concrete test cases as `-` bullets after a short lead-in. No vague "covers the new badge".
5. **No essays.** No Given/When/Then walls, no `AC1/AC2` headers, no nested `**Scenario**` blocks.
6. **No `CHR-` or `AC1 –`** prefixes inside test titles.
7. **English only** inside the Jira block.
8. **Mobile first** (`390×844`) for E2E / manual / a11y; append `(desktop)` only when behaviour diverges.
9. **Check existing tests first.** Every layer line is the result of a real coverage scan: classify each scope `already-covered` (→ `Not applicable.`) / `update` / `gap` / `not applicable`. A `gap` requires evidence no spec covers it.
10. **Never invent contracts.** No endpoint/method/sample response in the ticket → `Pact - Not applicable.` + flag in the chat summary only.
11. **No Component-level tests** — out of scope for CHR tickets.
12. **QA checklist is mandatory** — ≥1 verifiable bullet per acceptance criterion, so anyone can sign off the ACs without reading the automated layers.

---

## Output template (what goes inside the Jira panel)

Plain paragraphs separated by horizontal rules. Layer name in **bold**, paths in `inline code`. UT/IT/Pact/E2E proposing work must enumerate scenarios as bullets after a short lead-in.

```text
**Testing Strategy**

**UT**
Ticket's functional ACs are covered with unit tests (or integration tests, if it is not possible to cover on unit level).
- <scenario 1>
- <scenario 2>

---

**IT**
<short lead-in describing the file or area>
- <scenario 1>

Translation: <Not applicable. | short lead-in>
- <copy key or step to cover>

---

**Pact**
<short lead-in describing the endpoint(s)>
- METHOD /path — <success | <status code>>

---

**E2E**
<short lead-in describing the journey or spec to extend>
- <scenario 1>

---

**Accessibility**
<Not applicable. | short lead-in>
- <page or section> — axe + keyboard

---

**UAT**
Not applicable.

---

**QA checklist**
Minimum manual QA before sign-off. Verify every acceptance criterion.
- Pre: <env URL, account, flags> (390×844 unless desktop-only)
- <one verifiable check distilled from AC 1>
- <one verifiable check distilled from AC 2>

---

**Manual testing / Exploratory**
<Not applicable. | checklist below>
- Pre: <env URL, account, flags>
- <step 1>
```

### Per-line shapes (exactly one per layer)

| Decision | Line shape | Bullets? |
|----------|-----------|----------|
| Does not apply **or** already fully covered | `Not applicable.` | No |
| Existing spec needs adjustment | `` Update `<path>`: <one-line summary>. `` | **Yes** — every scenario to add |
| Existing E2E journey extended | `` Extend `<path>`: <one-line summary>. `` | **Yes** — every new assert/step |
| Net-new work | one-line lead-in describing the file/area | **Yes** — every scenario |

> `Not applicable.` is the **only** line for "doesn't apply" and "already covered". Never `Covered by <path>.`.

- **UT exception:** keep the fixed sentence verbatim, then bullet every required UT scenario. If existing UT specs already cover all ACs, write `UT - Not applicable.` instead (rare).
- **Translation exception:** never its own section — a sub-line under IT (`Translation: …`). List new copy keys/steps as bullets below it.

### Bullet rules (UT / IT / Pact / E2E)

- One bullet = one `it()` / `test()` / pact interaction. Concrete, single case.
- Format `- <short descriptive title>` (imperative or "shows X when Y").
- No duplicates across layers — list a scenario at the most natural level only.
- **Pact:** `METHOD /path — <success | <status code>>`. **E2E:** `<route> — <key user actions> — <main assert>`, append `(desktop)` only when desktop diverges.
- Max 5 bullets per layer — prune to the ones protecting the ACs.

---

## Per-layer decision rules

### UT — always present
- Keep the fixed sentence verbatim, then bullet every UT scenario (one bullet = one `it()`): **gap** → declarative titles (`- shows X when Y`); **update** → `` Update `path.unit.spec.tsx`: <change>. `` plus a bullet per new `it()`.
- Do not list ACs already covered by an existing UT spec. Never propose UT for constants or visible copy (→ Translation under IT). If behaviour cannot be unit-tested (composition, multiple API calls, multistep form) → push to IT.

### IT — only when justified

| Include when | `Not applicable.` when |
|--------------|------------------------|
| Standalone form | Fully covered at UT level |
| Multistep form (top-level only — never per-step) | Copy-only change |
| Workflow combining multiple components or API calls | Logic already tested at UT |
| Composed error / loading states | Existing integration spec already exercises it |

Prefer `` Update `<path>`: … `` when an integration spec exists. Cover happy path + one API error if exposed; no edge cases unless they change the flow.

### Translation — sub-line under IT

| Include when | `Translation: Not applicable.` when |
|--------------|-------------------------------------|
| New or changed visible copy keys | No copy change / internal refactor only |
| New form step (new namespace) | Existing translation spec already covers the copy |

Propose work as `` Translation: Update `path.translation.spec.tsx`: … `` (or a new-file lead-in) + a bullet per copy key/step.

### Pact — strict

| Include when | `Not applicable.` when |
|--------------|------------------------|
| New backend integration **and** ticket documents endpoint/method/sample response (or Swagger) | No API change |
| Changed contract **and** docs present | Existing pact spec covers the new shape; consumer ignores status codes; API changed but docs missing (flag in chat) |

Bullet format `METHOD /path — <success | <error code>>`. Prefer `Update` when a pact spec already covers the endpoint.

### E2E — narrow

| Include when | `Not applicable.` when |
|--------------|------------------------|
| Essential journey not covered by UT/IT | Existing E2E journey already covers it |
| Cross-page flow with new behaviour | UT/IT is sufficient |

Prefer `` Extend `<path>`: … `` over a new file. Happy path + generic actions only; no edge/error/negative cases unless they change the journey. Bullet `<route> — <key user actions> — <main assert>`.

### Accessibility — only on new surfaces

| Include when | `Not applicable.` when |
|--------------|------------------------|
| New page/layout/modal/major section **and** no existing `*.accessibility.spec.ts` covers it | Non-UI change, or an existing a11y spec already runs axe on that surface |

Bullet each surface: `<page or section> — axe + keyboard`.

### UAT — always
`Not applicable.` Humans add UAT later.

### QA checklist — always (minimum AC coverage)

| Rule | Detail |
|------|--------|
| Always include | Never `Not applicable.` unless the ticket has **no** ACs (then: `Confirm acceptance criteria with PO before QA.`). |
| One bullet per AC | Map every AC to **exactly one** actionable check. Split a multi-THEN AC only when each clause needs a distinct step (≤ 8 bullets total). |
| Wording | `<route or surface> — <action> — <expected outcome>`. No `AC1`/`AC-1`/`CHR-` prefixes. |
| Preconditions | One optional `Pre:` line (env, account, flags). Mobile first; `(desktop)` only when diverging. |
| Scope | What QA **must** run manually — what a human observes, not what a spec asserts. Do not duplicate automated bullets. |
| Extra bugs | Bugs outside the ACs → bullets **after** the AC checks, only when QA must verify the fix. |

**Example:** AC "GIVEN category page, WHEN filter opens, THEN providers list only shows providers for that category." → `/casino/table-games — open filter — provider chips list only Blueprint and NetEnt (not full catalogue)`.

### Manual testing / Exploratory — sparingly

| Include when | `Not applicable.` when |
|--------------|------------------------|
| External service only on Staging/QA | Technical / test-only / refactor ticket |
| Feature flag mocks cannot exercise | Behaviour fully covered by mocks |
| Visual/behavioural detail mocks cannot prove | AC verification already under **QA checklist** (never repeat AC checks here) |

Format: one preconditions line + 3–5 steps, mobile first. AC checks belong only under **QA checklist**.

---

## Tools (Atlassian + GitLab MCPs)

| Source | Tool | Pass |
|--------|------|------|
| `user-atlassian` | `getAccessibleAtlassianResources` | none — only if hostname `cloudId` lookup fails |
| `user-atlassian` | `getJiraIssue` | `cloudId`, `issueIdOrKey: "CHR-XXXX"`, `fields: ["summary","description","status","issuetype","customfield_11201"]`, `responseContentFormat: "adf"` |
| `user-atlassian` | `editJiraIssue` | `cloudId`, `issueIdOrKey`, `fields: { description: <ADF root> }`, `contentFormat: "adf"` |
| `user-gitlab` | `get_merge_request_changes` | `project_id: "<GITLAB_PROJECT_PATH>"`, `merge_request_iid: <iid>` |
| Workspace | `Read`, `Grep`, `Glob` | on `lottoland-fe` |

- **MR link** = Jira field `customfield_11201` (URL or `!iid`) → extract the iid.
- **Cloud ID** for `<JIRA_HOST>`: resolve the hostname from env (`JIRA_HOST` / `JIRA_URL`), `.env.local`, or `~/.cursor/mcp.json`; try that hostname first; only call `getAccessibleAtlassianResources` on failure.
- **GitLab `project_id`:** resolve `<GITLAB_PROJECT_PATH>` the same way (`GITLAB_PROJECT_PATH` env or local untracked config). Do not hardcode company hosts or project paths.

---

## ADF: build and patch the panel

The description is an ADF doc; the Testing Strategy lives in a `panel` node whose first text is "Testing Strategy".

### Locate the panel (pseudocode)

```text
function findStrategyPanel(node):
  if node.type == "panel":
    firstText = first non-empty text descendant (recurse paragraph/heading content)
    if normalize(firstText) == "testing strategy": return node
  for child in (node.content or []):
    found = findStrategyPanel(child); if found: return found
  return null
```

`normalize` = trim + lowercase, ignore punctuation. Then:

- **Panel found** → replace **only** `panel.content`; keep `attrs.panelType`.
- **No panel but a top-level `Testing Strategy` heading** → the section spans from that heading to the next equal/higher heading, next `rule`, or end of `doc.content`. Replace that span with a fresh `panel` (`panelType: "info"`); preserve a surrounding `rule` if one separated it.
- **Nothing found** → normal; append a `rule` (only if the previous top-level node is not already a `rule`) + a fresh `panel` (`panelType: "info"`) at the end of `doc.content`. No extra confirmation beyond the draft preview.
- **Two or more matching panels** → do not edit; report and ask whether to (a) append a fresh info panel and leave duplicates, or (b) skip for manual cleanup.

### Build the new panel content (template)

For UT/IT/Pact/E2E, when the decision is `Update …` or net-new, **add a `bulletList` after the decision paragraph** (one `listItem` per scenario). When `Not applicable.`, omit the bullet list.

```json
[
  { "type": "paragraph", "content": [{ "type": "text", "text": "Testing Strategy", "marks": [{ "type": "strong" }] }] },

  { "type": "paragraph", "content": [{ "type": "text", "text": "UT", "marks": [{ "type": "strong" }] }] },
  { "type": "paragraph", "content": [{ "type": "text", "text": "Ticket's functional ACs are covered with unit tests (or integration tests, if it is not possible to cover on unit level)." }] },
  { "type": "bulletList", "content": [
    { "type": "listItem", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "<UT scenario 1>" }] }] }
  ]},

  { "type": "rule" },

  { "type": "paragraph", "content": [{ "type": "text", "text": "IT", "marks": [{ "type": "strong" }] }] },
  { "type": "paragraph", "content": [{ "type": "text", "text": "<IT decision lead-in, paths as code marks>" }] },
  { "type": "bulletList", "content": [
    { "type": "listItem", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "<IT scenario 1>" }] }] }
  ]},
  { "type": "paragraph", "content": [
    { "type": "text", "text": "Translation: " },
    { "type": "text", "text": "<translation decision text>" }
  ]},

  { "type": "rule" },

  { "type": "paragraph", "content": [{ "type": "text", "text": "Pact", "marks": [{ "type": "strong" }] }] },
  { "type": "paragraph", "content": [{ "type": "text", "text": "<Pact decision lead-in>" }] },

  { "type": "rule" },

  { "type": "paragraph", "content": [{ "type": "text", "text": "E2E", "marks": [{ "type": "strong" }] }] },
  { "type": "paragraph", "content": [{ "type": "text", "text": "<E2E decision lead-in>" }] },

  { "type": "rule" },

  { "type": "paragraph", "content": [{ "type": "text", "text": "Accessibility", "marks": [{ "type": "strong" }] }] },
  { "type": "paragraph", "content": [{ "type": "text", "text": "<Accessibility decision — usually 'Not applicable.'>" }] },

  { "type": "rule" },

  { "type": "paragraph", "content": [{ "type": "text", "text": "UAT", "marks": [{ "type": "strong" }] }] },
  { "type": "paragraph", "content": [{ "type": "text", "text": "Not applicable." }] },

  { "type": "rule" },

  { "type": "paragraph", "content": [{ "type": "text", "text": "QA checklist", "marks": [{ "type": "strong" }] }] },
  { "type": "paragraph", "content": [{ "type": "text", "text": "Minimum manual QA before sign-off. Verify every acceptance criterion." }] },
  { "type": "bulletList", "content": [
    { "type": "listItem", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Pre: <env, account, viewport>" }] }] },
    { "type": "listItem", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "<AC check 1>" }] }] }
  ]},

  { "type": "rule" },

  { "type": "paragraph", "content": [{ "type": "text", "text": "Manual testing / Exploratory", "marks": [{ "type": "strong" }] }] },
  { "type": "paragraph", "content": [{ "type": "text", "text": "<Manual decision — 'Not applicable.' or 'checklist below'>" }] }
]
```

### ADF node snippets

- **Bold:** `{ "type": "text", "text": "UT", "marks": [{ "type": "strong" }] }`
- **Inline code (path):** `{ "type": "text", "text": "shared/.../Foo.integration.spec.tsx", "marks": [{ "type": "code" }] }`
- **Mixed paragraph (text + path):** combine plain `text` nodes with `code`-marked path nodes in one `paragraph.content` array.
- **Bullet list:** `{ "type": "bulletList", "content": [{ "type": "listItem", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "shows badge when appOnly=true" }] }] }] }`
- Bullets are **required** under UT/IT/Pact/E2E for `Update …` / `Extend …` / net-new; **omitted** for `Not applicable.`.
- **QA checklist** always has a `bulletList` after its lead-in (Pre + one bullet per AC, ≤ 8 total).

### When you cannot/should not patch

- **No panel/heading at all** → not a blocker; append a fresh `panelType: "info"` panel at the end (with a `rule` before it if needed).
- **Two or more matching panels/sections** → do not edit; report and offer append-fresh-or-skip.
- **No `description` returned** (rare) → do not edit; report.
- **`--no-jira-update`** → never call `editJiraIssue`.

---

## Knowledge base + test locations

| Layer | Rule file (read in full before drafting) | Test glob |
|-------|------------------------------------------|-----------|
| UT | `.cursor/rules/testing/unit-testing.mdc` | `**/*.unit.spec.{ts,tsx}` |
| IT | `.cursor/rules/testing/integration-testing.mdc` | `**/*.integration.spec.{ts,tsx}` under `shared/components/**`, `apps/**` |
| Translation | `.cursor/rules/testing/translation-testing.mdc` | `**/*.translation.spec.{ts,tsx}` |
| Pact | `.cursor/rules/testing/pact-testing.mdc` | `test/pact/tests/**/*.spec.ts` |
| E2E | `.cursor/rules/testing/e2e-testing.mdc` | `test/e2e/tests/**/*.spec.ts` (exclude `*.accessibility.spec.ts`) |
| Accessibility | `.cursor/rules/testing/accessibility-testing.mdc` | `test/e2e/tests/**/*.accessibility.spec.ts` |

Reference doc: `docs/adrs/0027-qa-strategy-functional-tests.md`.

---

## Workflow

### Phase 1 — Ingest
1. Get `cloudId` for `<JIRA_HOST>` (from env / local config, not a hardcoded host).
2. `getJiraIssue` with the fields + `responseContentFormat: "adf"`. **Keep the full ADF** — you patch it in Phase 4.
3. Extract: numbered ACs, issue type/status, change-type signals (UI/API/new page/form/i18n/config-only/test-only), MR iid from `customfield_11201`.
4. If an MR exists → `get_merge_request_changes`; identify the **feature area** from the touched files.

### Phase 2 — Coverage scan (mandatory)
Search the workspace **before** writing any layer, using the feature area path and key filenames:
- **Integration** — `Glob` `**/*.integration.spec.{ts,tsx}` near the dir, then `Grep` the component name.
- **Translation** — `Glob` `**/*.translation.spec.{ts,tsx}` for the feature dir.
- **Pact** — `Grep "<endpoint/service>" test/pact/tests/`.
- **E2E** — `Grep "<route/page>" test/e2e/tests/` (exclude a11y).
- **Accessibility** — `Glob test/e2e/tests/**/*.accessibility.spec.ts` + `Grep` the page/section.

`Read` each candidate (at least `describe`/`it`) and classify the AC: **already-covered** (→ `Not applicable.`, mention path in chat only) / **update** / **gap** (needs evidence no spec covers it) / **not applicable**. Read the relevant `.mdc` rule files for layers with `update`/`gap`.

### Phase 3 — Decide + draft
Apply the per-layer rules and produce the template output. Build the **QA checklist** from the ACs (each AC → one human-verifiable bullet, appearing exactly once unless split per rule). Pause only for: new backend integration with no endpoint docs (→ `Pact - Not applicable.`, mention in chat) or E2E ambiguity (default conservative).

**Flags** (from the user's first message, never re-asked): `--mr=<iid>` (MR IID when missing) · `--no-jira-update` (draft only) · `--apply` (update after the draft+diff, no second confirmation) · `--no-e2e` / `--no-a11y` (force `Not applicable.` unless covered/update applies).

### Phase 4 — Deliver + update

**Exit caveman.** Plain professional English from here.

1. **English chat summary** (brief): one line per layer (decision + path) + **QA checklist** with AC count; mention gaps (missing API docs, dead spec).
2. **Text preview** of the block as a fenced ```text``` block.
3. **Update description** unless `--no-jira-update`: run the locate algorithm on the Phase 1 ADF → build `panel.content` from the template (drop layer paragraphs needing no bullets; add bullet lists only where you have bullets) → existing panel: mutate in place keeping `attrs.panelType`; no panel/heading: append a fresh `panelType: "info"` panel at the end (with a `rule` if needed) → show a before/after of the panel region → wait for `ok`/`yes`/`go ahead` (skip with `--apply`) → `editJiraIssue` with `contentFormat: "adf"`.
4. Never touch other fields or ADF outside the panel. Never `addCommentToJiraIssue`.

---

## Common pitfalls

- Refusing to edit when no panel exists — just append a fresh `panelType: "info"` panel at the end.
- `TBD` anywhere (banned); `N/A — because …` or `Covered by <path>.` in the Jira block (use standalone `Not applicable.`; reasons in chat).
- Vague layer paragraphs without bullets when work is proposed; listing already-covered UT items.
- Inventing endpoint paths / sample responses for Pact (missing docs → `Pact - Not applicable.` + flag).
- `## headings` or markdown `**bold**` inside the ADF panel (use marks `strong`/`code`/`em`).
- Skipping the coverage scan (every `gap` needs evidence); stripping the panel container (replace `panel.content` only, keep `attrs.panelType`).
- Editing other fields in `editJiraIssue`; writing a comment instead of the description.
- Same AC under both UT and IT (pick the level closest to the change); E2E for trivial UI tweaks (default `Not applicable.`/`Extend …`).
- Skipping the QA checklist when ACs exist; duplicating AC checks under Manual; copying UT/IT/E2E bullets into the QA checklist (checklist = product behaviour a human verifies).

---

## Worked example (abbreviated)

CHR-XXXX: "Show `App exclusive` badge for app-only promotions." 1 AC. MR `!4321` touches `…/Promotions/PromotionsList.tsx`.

**Coverage scan:** `PromotionsList.unit.spec.tsx` exists, no badge logic → **gap (UT)** · `PromotionsList.integration.spec.tsx` does not assert the badge → **update** · `PromotionsList.translation.spec.tsx` needs the new key → **update** · no pact spec, no API change → **not applicable** · `test/e2e/tests/marketing/promotions.spec.ts` does not assert → **extend** · `…/promotions.accessibility.spec.ts` exists → **already-covered**.

**Chat summary (one line per layer, English, brief):**

```text
UT  → gaps in PromotionsList.unit.spec.tsx (badge logic).
IT  → update PromotionsList.integration.spec.tsx with the filter.
TRN → update PromotionsList.translation.spec.tsx with the new key.
Pact → not applicable (no contract change).
E2E → extend test/e2e/tests/marketing/promotions.spec.ts with the badge assertion.
A11y → already covered by promotions.accessibility.spec.ts (not noted in the panel).
QA checklist → 2 bullets (1 AC with two outcomes: badge visible / no badge).
Manual → not applicable.
```

**Resulting Jira block (text preview):**

```text
**Testing Strategy**

**UT**
Ticket's functional ACs are covered with unit tests (or integration tests, if it is not possible to cover on unit level).
- shows "App exclusive" badge when promotion has appOnly=true
- hides badge when appOnly=false

---

**IT**
Update `…/PromotionsList.integration.spec.tsx`: assert badge renders for app-only promotions.
- renders badge for app-only promotion in the list
- does not render badge for non-app promotions

Translation: Update `…/PromotionsList.translation.spec.tsx`: covers new badge copy key.
- promotions.list.badge.appExclusive

---

**Pact**
Not applicable.

---

**E2E**
Extend `test/e2e/tests/marketing/promotions.spec.ts`: assert badge visibility.
- /promotions — load list with one app-only promo — badge visible on that pod
- /promotions — load list without app-only promos — no badge visible

---

**Accessibility**
Not applicable.

---

**UAT**
Not applicable.

---

**QA checklist**
Minimum manual QA before sign-off. Verify every acceptance criterion.
- Pre: UK staging, logged-out, 390×844
- /promotions — app-only promotion in list — "App exclusive" badge visible on that pod
- /promotions — no app-only promotions — no badge on any pod

---

**Manual testing / Exploratory**
Not applicable.
```

That preview becomes the ADF panel via the template above (bold = `strong`; paths = `code`; `---` = `rule`; bullets = `bulletList`).

---

## Checklist

```text
[ ] Caveman ON (all intermediate messages)
[ ] cloudId + getJiraIssue (adf) + parse ACs + MR iid
[ ] get_merge_request_changes → feature area
[ ] Coverage scan (UT/IT/TRN/PCT/E2E/A11Y) → already-covered | update | gap | not applicable
[ ] Read relevant *.mdc rules for in-scope layers
[ ] Draft block (≤ 5 bullets/layer, no TBD, no "Covered by …", "Not applicable." for skipped/covered)
[ ] Enumerate scenarios under UT/IT/Pact/E2E whenever Update/Extend/new work
[ ] QA checklist: Pre + one bullet per AC (≤ 8); no AC checks under Manual
[ ] Caveman OFF → English chat summary (one line per layer + QA checklist AC count) + text preview
[ ] Locate panel or append new panel at end → build ADF → diff → editJiraIssue (adf)
```
