# qa-feedback

Cursor skill for desk-side QA review (no browser): ACs vs implementation, missing tests, MR pipeline. Posts one **QA Feedback** Jira comment after you confirm.

Sanitized playground copy of `.agents/skills/testing/qa-feedback`. Copy into the target repo as `.agents/skills/testing/qa-feedback`. Fill placeholders from a private doc or local env — never commit real hosts.

## How to use

1. Copy this skill (and the rest of `testing/`) into the product repo under `.agents/skills/testing/`.
2. Agent mode + project skills + Atlassian and GitLab MCPs.
3. Paste the prompt. This skill **may** auto-invoke (`disable-model-invocation: false`). The Jira comment is not posted until you confirm.

## Ready-to-use prompt

```
qa feedback CHR-XXXX
```

Also accepts a Jira URL or `feedback CHR-XXXX`.

## Folder contents

- `SKILL.md` — AC review, spec scan, pipeline check, comment template
- `reviewers/reviewer-a.md` — review tone and patterns (also used by qa-code-review)

## Constraints (do not change when invoking)

- Static review only: Jira + GitLab diff + `*.spec.*`
- Do not open a browser, run suites, or edit source/tests
- Do not edit the ticket description (`editJiraIssue`)
- One ticket → one comment, after confirmation
