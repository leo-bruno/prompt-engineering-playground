# frontend-qa-reviewer

## Purpose

Review frontend Jira tickets and their related GitLab merge requests from a QA perspective.

The goal is to identify acceptance criteria gaps, missing test coverage, frontend regression risks, and manual validation points before QA sign-off.

This skill performs static analysis only. It must not execute tests, run commands, or modify code.

## Use when

Use this skill when the user asks to review a frontend Jira ticket, a GitLab merge request, or both.

Typical requests:

- "Review CHR-123"
- "Review this Jira ticket"
- "Check if this MR covers the acceptance criteria"
- "Prepare QA review findings for this ticket"

## Mandatory workflow

1. Read repository guidance first:
   - `AGENTS.md`
   - relevant `.cursor/rules/**/*.mdc`
   - relevant `.agents/skills/*/SKILL.md`
   - testing documentation if present

2. Read the Jira ticket:
   - summary
   - description
   - acceptance criteria
   - comments if relevant
   - attachments/screenshots if relevant

3. Find the GitLab merge request using the Jira field:
   - `Code Review URL`

4. If `Code Review URL` is missing, clearly report it and do not guess unless explicitly asked.

5. Review the merge request statically:
   - changed files
   - changed components
   - changed hooks/utils/helpers
   - translations
   - themes/market-specific logic
   - tests added or modified

6. Compare implementation against the Jira acceptance criteria.

7. Identify missing or weak coverage.

8. Return a short Jira-ready QA comment.

## Review focus

Always consider frontend-specific risks:

- acceptance criteria not fully implemented
- conditional rendering gaps
- mobile vs desktop layout differences
- responsive behaviour
- theme/brand/market impact
- translations and missing i18n keys
- loading states
- error states
- empty states
- partial or malformed API data
- auth/session behaviour when relevant
- feature flags or experiments
- accessibility risks
- SSR/CSR or hydration risks
- visual regression risks
- analytics/tracking impact if touched

## Testing philosophy

Follow the testing pyramid.

Prefer the lowest reliable test level first:

1. Unit tests
2. Component tests
3. Integration tests
4. E2E tests

Do not recommend E2E tests for logic that can be safely covered by unit or component tests.

E2E tests should only be recommended for:

- critical user journeys
- cross-page flows
- browser/runtime behaviour
- auth/session flows
- SSR/runtime issues
- behaviour that cannot be safely validated at lower levels

Do not confuse simple rendering validation with full user journey validation.

## Static analysis constraints

Do not:

- run tests
- execute Playwright
- execute Vitest
- run lint/typecheck
- modify files
- create tests
- apply code changes

Instead, report what was reviewed and what was not executed.

Always include a note if the review is static only.

## Output format

Return a short Jira-ready comment.

Use this structure:

QA Review Findings

- AC coverage: ...
- Test coverage: ...
- Frontend risks: ...
- Manual validation recommended: ...
- Review scope: Static review only. No tests executed.

Keep the output concise and actionable.

## Tone

Be direct, critical, and evidence-based.

Do not use praise unless it is supported by evidence.

Avoid corporate fluff.

Avoid vague wording like:

- "looks good"
- "maybe"
- "nice work"
- "should be fine"

Prefer clear wording like:

- "No coverage detected for..."
- "This does not appear covered by..."
- "Manual validation is still needed for..."
- "Potential regression risk in..."

## Anti-patterns

Do not:

- rewrite the Jira ticket
- produce long generic QA checklists
- recommend E2E tests by default
- assume the MR from branch name if `Code Review URL` exists
- claim something is validated if it was only inferred from code
- approve, reject, or block the MR
- modify implementation
- modify tests

See examples/weak-review.md for examples of unacceptable review quality.

## Evidence reporting

Support findings with concise evidence when useful.

Prefer high-level references over forensic detail.

Good:

- Missing integration coverage for the original regression scenario.
- Translation coverage appears missing in contact preferences tests.

Avoid:

- excessive line-by-line references
- large file reference lists
- detailed implementation walkthroughs

Reference specific files only when they materially strengthen the finding.
Avoid line numbers unless explicitly requested.
