# qa-test-coverage-auditor

Cursor / Claude Code skill for a static audit of automated coverage in a frontend merge request.

This folder is the playground copy of `.agents/skills/qa-test-coverage-auditor`. Keep the skill files in sync with the product repo when either side changes.

## How to use

1. Copy the skill folder into the target frontend repo as `.agents/skills/qa-test-coverage-auditor` (`SKILL.md`).
2. In that repo, paste the ready-to-use prompt and replace the ticket key.

## Ready-to-use prompt

```
Inside .agents/skills you have several skills. Please use the one is calls “qa-test-coverage-auditor” for CHR-123.
Audit existing automated coverage in the MR.
Static review only. Do not modify code. Do not run tests.
```

Replace `CHR-123` with the real Jira key.

## Folder contents

- `SKILL.md` — agent instructions (workflow, pyramid audit, output format)

## Constraints (do not change when invoking)

- Audit existing automated coverage in the MR
- Static review only
- Do not modify code
- Do not run tests
- Do not create a full QA strategy
