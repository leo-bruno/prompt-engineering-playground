# frontend-test-strategy-generator

## Purpose

Generate a pragmatic frontend QA test strategy for Jira tickets and frontend features.

The goal is to propose appropriate automated and manual coverage following the testing pyramid and existing repository conventions.

This skill does not execute tests or modify code.

## Use when

Use this skill when:

- defining QA scope for a new feature
- preparing automation coverage
- planning frontend testing strategy
- refining Jira tickets
- discussing QA implementation before development
- reviewing large frontend features

Typical requests:

- "Generate test strategy for CHR-2500"
- "Create QA strategy for this feature"
- "What automation coverage should this ticket have?"
- "How should this frontend feature be tested?"

## Mandatory workflow

1. Read repository guidance first:
   - `AGENTS.md`
   - relevant `.cursor/rules/**/*.mdc`
   - testing documentation
   - existing testing patterns
   - existing frontend architecture patterns

2. Read the Jira ticket carefully:
   - summary
   - description
   - acceptance criteria
   - linked designs/screenshots if available

3. Inspect existing implementations and tests before proposing new coverage.

4. Reuse existing testing patterns whenever possible.

5. Generate a practical and risk-based testing strategy.

## Testing philosophy

Always follow the testing pyramid:

1. Unit tests
2. Component tests
3. Integration tests
4. E2E tests

Prefer the lowest reliable testing level first.

Do not recommend E2E coverage for behaviour that can be safely validated with unit or component tests.

E2E tests should only cover:

- critical user journeys
- cross-page flows
- auth/session behaviour
- browser/runtime behaviour
- SSR/runtime issues
- functionality not safely testable at lower levels

## Frontend review focus

Consider:

- mobile vs desktop behaviour
- responsive layouts
- themes/brands/markets
- translations and i18n
- loading states
- error states
- empty states
- partial API data
- conditional rendering
- feature flags
- accessibility impact
- analytics/tracking impact
- visual regression risks

## Strategy structure

Use this fixed section order in the output:

1. Testing Strategy
2. UT
3. IT
4. Translation
5. Pact
6. E2E
7. Accessibility
8. UAT
9. Manual testing / Exploratory

All sections must always be present.

If a section is not applicable, write:

- Not applicable.
- Reason (one line).

## Coverage recommendations

Distinguish clearly between:

- Required coverage
- Recommended coverage
- Optional coverage
- Manual-only validation

Avoid overengineering.

Recommend the minimum reliable coverage needed for the feature risk level.

For **every section** (UT, IT, Translation, Pact, E2E, Accessibility, UAT, Manual):

- Include exact repository file path(s) when applicable.
- Include concrete test cases/assertions (behaviour-level bullets).
- Do not leave high-level statements without specific checks.
- If there is no file to update (for example pure manual validation), explicitly state that and still list concrete checks.

For each test case description, prefer clear expected behaviour:

- "assert X is hidden/disabled"
- "assert Y copy is shown"
- "assert Z action is blocked"

Do not use vague wording.

## Repository awareness

Inspect existing tests before proposing:

- new test structures
- new test naming
- new architecture patterns
- new testing approaches

Do not invent file names, test suites, or framework patterns unless they already exist in the repository.

## Static analysis constraints

Do not:

- run tests
- execute Playwright
- execute Vitest
- modify files
- generate implementation code
- generate production test code

This skill proposes strategy only.

## Output style

Generate structured and concise QA strategy documents.

Write in concise technical English.

Be practical and implementation-oriented.

Avoid:

- generic QA theory
- unnecessary verbosity
- over-prescribing automation
- recommending E2E by default
- excessive architectural speculation

Prefer actionable recommendations tied directly to the feature behaviour.

Separate similar states explicitly when relevant (for example `expired` vs `reclaimable with next date`) and include regression guards where needed.

## Output template (mandatory)

Use this template structure:

```md
Testing Strategy

UT
- File: `path/to/file`
  - assertion/case
  - assertion/case

IT
- File: `path/to/file`
  - assertion/case

Translation
- File: `path/to/file` (or "Not applicable")
  - assertion/case or reason

Pact
- File: `path/to/file` (or "Not applicable")
  - assertion/case or reason

E2E
- File: `path/to/file`
  - assertion/case

Accessibility
- File: `path/to/file` (or "Manual validation only")
  - assertion/case

UAT
- Not applicable.
- Reason.

Manual testing / Exploratory
- Preconditions
- Checks
```

Do not add extra top-level sections.

## Final validation checklist (mandatory before answering)

Verify all items:

1. Acceptance criteria are explicitly covered.
2. Missing tests are explicitly identified.
3. Regression risks are explicitly listed.
4. Mobile and desktop impact is explicitly covered when relevant.
5. Every section includes file path(s) and concrete checks, or explicit non-applicability reason.

## Tone

Be direct, technical, and pragmatic.

Do not use corporate language or filler text.

Avoid vague wording such as:

- "maybe add tests"
- "consider testing"
- "looks fine"

Prefer:

- "Unit coverage should validate..."
- "Integration coverage is recommended for..."
- "E2E is unnecessary because..."
- "Manual validation is sufficient for..."
