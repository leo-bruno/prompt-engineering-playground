Prompts for AI agents, their behaviors, and orchestration patterns.

Each reusable agent lives in its own folder:

- `README.md` — ready-to-use invocation prompt and how to run it
- `SKILL.md` — full skill / system instructions
- `examples/` — good, weak, and other behaviour samples when needed

## Agents

- [`frontend-qa-reviewer`](./frontend-qa-reviewer/) — static QA review of a frontend Jira ticket and its GitLab MR; returns a short Jira-ready comment
- [`frontend-test-strategy-generator`](./frontend-test-strategy-generator/) — concise frontend QA strategy following the testing pyramid; strategy only, no code or test execution
- [`frontend-edge-case-generator`](./frontend-edge-case-generator/) — frontend edge cases only; does not create a test strategy
- [`qa-test-coverage-auditor`](./qa-test-coverage-auditor/) — static audit of automated coverage in the MR; does not run tests or modify code

### Lottoland-fe QA suite

Product copy lives at `.agents/skills/testing/`. This playground copy is sanitized (placeholders instead of internal hosts and credentials).

- [`testing/qa-test-strategy`](./testing/qa-test-strategy/) — Testing Strategy panel on the Jira **description** (preview unless `--apply`)
- [`testing/qa-feedback`](./testing/qa-feedback/) — desk-side AC / tests / pipeline review; Jira comment after confirm (may auto-invoke)
- [`testing/qa-code-review`](./testing/qa-code-review/) — review of MR **test files** only; GitLab comments only if you ask to post
- [`testing/qa-tester`](./testing/qa-tester/) — manual QA on a deployed URL; evidence + Jira report

These are a Cursor agent + MCP channel. Vitest/Playwright in GitLab CI is separate. They overlap with `frontend-qa-reviewer`, `frontend-test-strategy-generator`, and `qa-test-coverage-auditor` (those stay as prompt-only variants).
