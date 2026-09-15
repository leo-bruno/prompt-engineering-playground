# qa-code-review

Cursor skill that reviews **test files** in a GitLab MR (unit, integration, e2e, pact, a11y, translation). Ignores product code. Prepares inline comments; does not post until you ask.

Sanitized playground copy of `.agents/skills/testing/qa-code-review`. Copy into the target repo as `.agents/skills/testing/qa-code-review`. Fill placeholders from a private doc or local env — never commit real hosts.

## How to use

1. Copy this skill (and the rest of `testing/`) into the product repo under `.agents/skills/testing/`.
2. Agent mode + project skills + GitLab MCP. Testing rules live in the product repo at `.cursor/rules/testing/*.mdc`.
3. Paste the prompt with the MR URL. Does not auto-invoke. Never publish until you say `post the comments`.

## Ready-to-use prompt

```
code review https://<GITLAB_HOST>/<GITLAB_PROJECT_PATH>/-/merge_requests/XXXX
```

Also accepts `CR <url>` or `review MR <id>`.

## Folder contents

- `SKILL.md` — ingest, layer detection, reviewer-a + testing rules, GitLab discussion payload

## Constraints (do not change when invoking)

- Test files only; ignore implementation in the diff
- Do not auto-invoke
- Do not post GitLab comments until explicitly asked
