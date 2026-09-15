# frontend-test-strategy-generator

Cursor / Claude Code skill for a concise frontend QA strategy that follows the testing pyramid.

This folder is the playground copy of `.agents/skills/frontend-test-strategy-generator`. Keep the skill files in sync with the product repo when either side changes.

## How to use

1. Copy the skill folder into the target frontend repo as `.agents/skills/frontend-test-strategy-generator` (`SKILL.md`).
2. In that repo, paste the ready-to-use prompt and replace the ticket key.

## Ready-to-use prompt

```
Inside .agents/skills you have several skills. Please use the one is calls “frontend-test-strategy-generator” for CHR-123.
Create a concise frontend QA strategy following the testing pyramid.
Do not modify code. Do not run tests.
```

Replace `CHR-123` with the real Jira key.

## Folder contents

- `SKILL.md` — agent instructions (workflow, pyramid, mandatory output template)

## Constraints (do not change when invoking)

- Follow the testing pyramid
- Do not modify code
- Do not run tests
- Strategy only; do not generate production test code
