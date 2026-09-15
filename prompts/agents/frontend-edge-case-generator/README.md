# frontend-edge-case-generator

Cursor / Claude Code skill for frontend edge cases on a Jira ticket or merge request.

This folder is the playground copy of `.agents/skills/frontend-edge-case-generator`. Keep the skill files in sync with the product repo when either side changes.

## How to use

1. Copy the skill folder into the target frontend repo as `.agents/skills/frontend-edge-case-generator` (`SKILL.md`).
2. In that repo, paste the ready-to-use prompt and replace the ticket key.

## Ready-to-use prompt

```
Inside .agents/skills you have several skills. Please use the one is calls “frontend-edge-case-generator” for CHR-123.
Generate frontend edge cases only.
Do not create a test strategy.
```

Replace `CHR-123` with the real Jira key.

## Folder contents

- `SKILL.md` — agent instructions (workflow, edge-case focus, output format)

## Constraints (do not change when invoking)

- Generate frontend edge cases only
- Do not create a test strategy
- Do not modify code
- Do not run tests
