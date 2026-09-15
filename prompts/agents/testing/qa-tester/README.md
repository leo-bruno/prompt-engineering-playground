# qa-tester

Cursor skill for manual QA on a **deployed** app: plan, generic Playwright runner (`qa-plan.json` + `run-qa-plan.sh`), video/screenshots, upload evidence to Jira.

Sanitized playground copy of `.agents/skills/testing/qa-tester`. Copy into the target repo as `.agents/skills/testing/qa-tester`. Fill placeholders from a private doc or local env — never commit real hosts, API keys, or OTP topics.

## How to use

1. Copy this skill (and the rest of `testing/`) into the product repo under `.agents/skills/testing/`.
2. Agent mode + project skills + Atlassian MCP. Playwright MCP (or Cursor browser fallback) and Aiven are for this skill only.
3. Paste the prompt with ticket key **and** environment URL. Does not auto-invoke. If all ACs pass, posts the report; on failure, waits for your OK.

## Ready-to-use prompt

```
qa tester CHR-XXXX on https://<STAGING_FRONTEND_URL>/
```

Also accepts `qa test CHR-XXXX` or `run qa tests CHR-XXXX`. Optional flags: `--no-jira-video`, `--no-jira-evidence`.

## Folder contents

- `SKILL.md` — dossier, plan approval, execution, Jira report policy
- `reference.md` — env placeholders, player registration, OTP, evidence
- `scripts/` — `run-qa-plan.sh`, `run-qa-plan.mjs`, `upload-jira-evidence.sh`, plan template/schema

## Constraints (do not change when invoking)

- Not CI Vitest/Playwright `*.spec.ts` — generic `qa-plan.json` runner only
- User must provide the deployment URL
- Do not edit product code; `qa-plan.json` and `evidence/` are run artefacts
- Never echo tokens, OTP, or `access_token`
