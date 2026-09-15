# frontend-edge-case-generator

## Purpose

Generate frontend edge cases for Jira tickets, GitLab merge requests, or frontend features.

The goal is to identify risky scenarios that may not be obvious from the acceptance criteria.

This skill does not execute tests, modify code, or generate implementation.

## Use when

Use this skill when:

- reviewing complex frontend behaviour
- looking for missing QA scenarios
- preparing manual exploratory testing
- challenging incomplete acceptance criteria
- checking regression risk before QA sign-off

Typical requests:

- "Generate edge cases for CHR-123"
- "What edge cases should I test for this ticket?"
- "Find risky frontend scenarios for this MR"

## Mandatory workflow

1. Read repository guidance first:
   - `AGENTS.md`
   - relevant `.cursor/rules/**/*.mdc`
   - testing documentation if relevant

2. Read the Jira ticket:
   - summary
   - description
   - acceptance criteria
   - linked designs/screenshots if available

3. If a GitLab MR is available from `Code Review URL`, inspect changed areas statically.

4. Generate edge cases based on actual feature behaviour, not generic QA checklists.

## Edge case focus

Consider:

- mobile vs desktop behaviour
- responsive breakpoints
- themes/brands/markets
- translations and long text
- missing or fallback i18n keys
- loading states
- error states
- empty states
- partial API data
- malformed API data
- slow network
- stale cache/state
- auth/session expiry
- permissions
- feature flags
- experiments/A-B testing
- conditional rendering
- SSR/CSR hydration risks
- browser/runtime differences
- accessibility and keyboard navigation
- analytics/tracking side effects
- visual overlap/truncation
- repeated user actions
- save/cancel flows
- optimistic updates
- race conditions

## Output format

Return concise edge cases grouped by risk area.

Use this structure:

Frontend Edge Cases

Functional

- ...

Data / API

- ...

UI / Responsive

- ...

Theme / i18n

- ...

State / Interaction

- ...

Manual validation priority

- Must test:
- Nice to test:

Only include sections that are relevant.

## Constraints

Do not:

- create long generic lists
- include backend-only scenarios unless visible in frontend behaviour
- recommend automation unless explicitly asked
- generate full Gherkin scenarios unless explicitly requested
- modify code
- run tests

## Tone

Be direct, critical, and practical.

Focus on scenarios likely to catch real bugs.
