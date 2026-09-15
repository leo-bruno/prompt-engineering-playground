# qa-test-strategy

Cursor skill that drafts the Testing Strategy panel (UT, IT, Pact, E2E, a11y, QA checklist, manual) and writes it into the Jira **description**, never a comment.

Sanitized playground copy of `.agents/skills/testing/qa-test-strategy`. Copy the folder into the target frontend repo as `.agents/skills/testing/qa-test-strategy`. Fill placeholders from a private doc or local env — never commit real hosts.

## How to use

1. Copy this skill (and the rest of `testing/`) into the product repo under `.agents/skills/testing/`.
2. Agent mode + project skills + Atlassian and GitLab MCPs.
3. Paste the prompt and replace the ticket key. Does not auto-invoke (`disable-model-invocation: true`). Preview first unless `--apply`.

## Ready-to-use prompt

```
QA test strategy CHR-XXXX
```

Also accepts a Jira URL, `testing strategy CHR-XXXX`, or `test plan CHR-XXXX`. Optional flags: `--mr=<iid>`, `--no-jira-update`, `--apply`, `--no-e2e`, `--no-a11y`.

## Folder contents

- `SKILL.md` — workflow, coverage scan, ADF panel patch, Jira write rules

## Constraints (do not change when invoking)

- Planning only; do not run tests or modify product code
- Edit the ticket **description** Testing Strategy panel, never a comment
- Show a preview and wait for ok unless `--apply`
