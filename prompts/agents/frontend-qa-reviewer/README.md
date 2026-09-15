# frontend-qa-reviewer

Cursor / Claude Code skill for static QA review of a frontend Jira ticket and its GitLab merge request.

This folder is the playground copy of `.agents/skills/frontend-qa-reviewer`. Keep the skill files in sync with the product repo when either side changes.

## How to use

1. Copy the skill folder into the target frontend repo as `.agents/skills/frontend-qa-reviewer` (`SKILL.md` plus `examples/`).
2. In that repo, paste the ready-to-use prompt and replace the ticket key.

## Ready-to-use prompt

```
Inside .agents/skills you have several skills. Please use the one is calls “frontend-qa-reviewer” to review CHR-123.
Static review only. Do not modify code. Do not run tests.
Return a short Jira-ready QA comment.
```

Replace `CHR-123` with the real Jira key.

## Folder contents

- `SKILL.md` — agent instructions (workflow, review focus, output format, anti-patterns)
- `examples/good-review.md` — acceptable Jira-ready comment
- `examples/weak-review.md` — unacceptable review quality
- `examples/overengineered-review.md` — too long / generic review

## Constraints (do not change when invoking)

- Static review only
- Do not modify code
- Do not run tests
- Return a short Jira-ready QA comment
