# qa-test-coverage-auditor

## Purpose

Audit frontend automated test coverage for Jira tickets and GitLab merge requests.

The goal is to evaluate whether the current automated coverage is appropriate, balanced, and aligned with the testing pyramid.

This skill performs static analysis only.

It does not execute tests or modify code.

## Use when

Use this skill when:

- reviewing large merge requests
- auditing frontend test quality
- checking testing pyramid balance
- identifying missing automated coverage
- detecting over-reliance on E2E tests
- validating frontend QA automation strategy

Typical requests:

- "Audit test coverage for CHR-123"
- "Review frontend automation coverage for this MR"
- "Is this feature correctly covered?"
- "Check testing pyramid balance"

## Mandatory workflow

1. Read repository guidance first:
   - `AGENTS.md`
   - relevant `.cursor/rules/**/*.mdc`
   - testing documentation
   - existing test patterns

2. Read the Jira ticket:
   - summary
   - description
   - acceptance criteria

3. Find the GitLab MR using:
   - `Code Review URL`

4. Review existing automated coverage:
   - unit tests
   - component tests
   - integration tests
   - pact tests
   - E2E tests

5. Compare coverage against:
   - feature complexity
   - business risk
   - frontend rendering complexity
   - regression risk

## Testing philosophy

Always follow the testing pyramid:

1. Unit tests
2. Component tests
3. Integration tests
4. E2E tests

Prefer the lowest reliable test level first.

Do not recommend E2E tests for behaviour safely covered at lower levels.

## Coverage audit focus

Check for:

- missing unit coverage
- missing integration coverage
- unnecessary E2E coverage
- duplicated coverage
- weak assertions
- missing regression protection
- missing loading/error/empty state coverage
- missing responsive coverage
- missing translation coverage
- missing theme/market coverage
- skipped or disabled tests
- flaky test patterns
- overly coupled tests
- implementation-detail testing
- poor mock strategy
- missing critical journey coverage

## Coverage evaluation

Distinguish clearly between:

- adequately covered
- partially covered
- under-covered
- over-covered
- risky coverage gaps

## Repository awareness

Inspect existing repository testing patterns before recommending changes.

Do not invent:

- new frameworks
- new testing architecture
- new test naming conventions

Reuse existing patterns whenever possible.

## Constraints

Do not:

- execute tests
- run Playwright
- run Vitest
- modify code
- generate production-ready tests
- create full QA strategies
- generate generic QA checklists

Focus only on auditing existing coverage quality.

## Output format

Return concise audit findings.

Use this structure:

Coverage Audit Findings

Adequately covered

- ...

Coverage gaps

- ...

Over-testing risks

- ...

Regression risks

- ...

Recommended improvements

- ...

Review scope

- Static analysis only. No tests executed.

Keep findings concise and evidence-based.

## Tone

Be direct, technical, and critical.

Avoid:

- corporate language
- generic praise
- vague recommendations

Prefer:

- "Missing integration coverage for..."
- "E2E coverage appears unnecessary for..."
- "Regression protection is weak for..."
- "Coverage is duplicated across..."
