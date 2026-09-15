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
