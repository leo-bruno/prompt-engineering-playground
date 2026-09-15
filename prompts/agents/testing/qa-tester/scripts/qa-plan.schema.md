# qa-plan.json schema

Generic input for [run-qa-plan.mjs](run-qa-plan.mjs). The agent writes **one JSON file per run** under `evidence/<CHR-XXXX>/` — no per-ticket JavaScript. The runner in `scripts/` is shared infrastructure (not ticket-specific, not stored in evidence).

## Top-level fields

| Field | Required | Description |
|-------|----------|-------------|
| `issueKey` | yes | e.g. `CHR-1289` — used for video filename |
| `baseUrl` | yes | Frontend origin, no trailing slash |
| `viewport` | no | Default `{ "width": 390, "height": 844 }` |
| `evidenceDir` | no | Output folder; defaults to directory containing the plan file |
| `variables` | no | Key/value strings; supports `{{name}}` interpolation in step values |
| `beforeAll` | no | Shared setup steps (login, navigation, cookies) |
| `scenarios` | yes | One object per AC / manual scenario |

Auto-injected variable: `runId` (random hex) — use in emails: `qa-{{runId}}@example.com`.

## Scenario object

```json
{
  "id": "ac1",
  "source": "AC1",
  "name": "Short scenario title",
  "steps": [ ... ]
}
```

## Step actions

| action | Fields | Notes |
|--------|--------|-------|
| `goto` | `path` or `url` | Relative `path` joins `baseUrl` |
| `acceptCookies` | — | OneTrust banner |
| `pause` | `ms` | Default 500 |
| `click` | `testId` or `selector` or `role`+`name` | Optional `force`, `timeout` |
| `fill` | `testId`/`selector`, `value` | Supports `{{variables}}` |
| `type` | `testId`/`selector`, `text`, `delay` | `pressSequentially`; use for DOB/OTP |
| `check` | `testId` | Checkbox click |
| `clearFields` | `testIds` | Array of test ids to clear |
| `screenshot` | `file` | Saved under `evidenceDir` |
| `assertVisible` | `testId`/`selector` | Waits for visible |
| `assertHidden` | `testId`/`selector` | Waits for hidden |
| `assertFocused` | `testId` | Active element test id |
| `assertUrl` | `pattern` | Current URL must include pattern |

Prefer `testId` — matches E2E `data-testid` conventions.

## Outputs

| File | Description |
|------|-------------|
| `<issue-key>-evidence.webm` | Full run video |
| `qa-results.json` | Per-scenario pass/fail |
| `ac*.png` / `fail-<id>.png` | Screenshots from steps |

Exit code `0` = all scenarios passed; `1` = at least one failure (video still saved).

## Template

Copy [qa-plan.template.json](qa-plan.template.json) to `evidence/<CHR-XXXX>/qa-plan.json` and replace placeholders from the approved test plan. Do not commit ticket-specific plans to `scripts/`.
