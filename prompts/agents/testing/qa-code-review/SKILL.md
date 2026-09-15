---
name: qa-code-review
description: >-
  Code review of QA test files in lottoland-fe: reads a GitLab MR diff, detects
  which test layers are present (pact, accessibility, e2e, component), applies the
  project testing rules and reviewer-a patterns, and produces inline comments ready
  to post to GitLab. Use when asked to review a MR, do a code review, or phrases
  like "code review <gitlab-url>", "CR <url>", "review MR <id>".
disable-model-invocation: true
---

# QA Code Review (lottoland-fe)

> **Caveman mode is ON from now.** Read `.agents/skills/caveman/SKILL.md` and apply it to all messages. Turn it off when delivering the final output.

> **Test files only.** This skill reviews only test files (`*.spec.*`, `test/e2e/`, `test/pact/`, `test/component/`). If the MR contains implementation code, ignore it — do not comment on it.

## Context

| What | Where |
|------|-------|
| Reviewer-a profile | `.agents/skills/testing/qa-feedback/reviewers/reviewer-a.md` |
| Pact rules | `.cursor/rules/testing/pact-testing.mdc` |
| E2E rules | `.cursor/rules/testing/e2e-testing.mdc` |
| Accessibility rules | `.cursor/rules/testing/accessibility-testing.mdc` |
| Component rules | `.cursor/rules/testing/component-testing.mdc` |
| Unit rules | `.cursor/rules/testing/unit-testing.mdc` |
| Integration rules | `.cursor/rules/testing/integration-testing.mdc` |
| Translation rules | `.cursor/rules/testing/translation-testing.mdc` |
| MCP GitLab | user-gitlab MCP — `get_merge_request_changes`, `create_merge_request_discussion` |

## Invocation

```
Code review https://<GITLAB_HOST>/<GITLAB_PROJECT_PATH>/-/merge_requests/XXXX
```

---

## Phase 0 — Ingest

1. Parse the MR URL: extract `project_id` (path after host, placeholder `<GITLAB_PROJECT_PATH>`) and `iid` (number at the end of the URL). If the user omits a full URL, resolve `<GITLAB_HOST>` and `<GITLAB_PROJECT_PATH>` from env, `.env.local`, or `~/.cursor/mcp.json` — never hardcode company hosts.
2. **GitLab MCP** — `get_merge_request_changes`: fetch the full diff + `base_sha`, `start_sha`, `head_sha` (required for inline comments).
3. List only changed test files:
   - `test/e2e/**/*.spec.*`
   - `test/pact/**/*.spec.*`
   - `test/component/**/*.spec.*`
   - `**/*.accessibility.spec.*`
   - `**/*.unit.spec.*`
   - `**/*.integration.spec.*`
   - `**/*.translation.spec.*`
4. Detect which test layers are present in the diff.

---

## Phase 1 — Load relevant rules

Read **only** the rule files for the layers detected in the diff:

| Layer detected | Read |
|----------------|------|
| `test/e2e/` or `.spec.ts` in e2e | `.cursor/rules/testing/e2e-testing.mdc` |
| `test/pact/` | `.cursor/rules/testing/pact-testing.mdc` |
| `*.accessibility.spec.*` | `.cursor/rules/testing/accessibility-testing.mdc` |
| `test/component/` | `.cursor/rules/testing/component-testing.mdc` |
| `*.unit.spec.*` | `.cursor/rules/testing/unit-testing.mdc` |
| `*.integration.spec.*` | `.cursor/rules/testing/integration-testing.mdc` |
| `*.translation.spec.*` | `.cursor/rules/testing/translation-testing.mdc` |

Always read the reviewer profile: `.agents/skills/testing/qa-feedback/reviewers/reviewer-a.md`.

---

## Phase 2 — Code review

Review each changed test file. For each file:

### Checklist per layer

**E2E** (`.cursor/rules/testing/e2e-testing.mdc`):
- Uses `setup` / `step` / `validate` fixtures correctly?
- Happy path covers the full journey?
- Critical error scenarios included (not edge cases — those belong in integration)?
- Allure metadata in `test.beforeAll()`: `epic`, `feature`, `tms`?
- No `page.waitForTimeout()` — use explicit waits or Playwright auto-wait?
- Locators use `data-testid` (not text or `data-track-name`)?
- Similar tests parametrised with `test.each`?
- Validations after each meaningful action via the `validate` fixture?

**Pact** (`.cursor/rules/testing/pact-testing.mdc`):
- Uses production types (no inline types in the test)?
- Exercises the API client layer, not UI or hooks?
- Covers the success scenario with the expected response shape?
- Error scenarios only when the consumer implements logic per status code?
- No business logic in the test (transformations, calculations)?
- Uses `like`, `eachLike`, `term` to avoid over-specifying volatile data?
- Does the `executeTest` callback only verify the request was made?

**Accessibility** (`.cursor/rules/testing/accessibility-testing.mdc`):
- Uses `step.accessibility.analyze()` for automatic WCAG checks?
- Validates with `validate.accessibility.hasNoViolations(results)`?
- Scans every relevant state (initial, after interaction, after data change)?
- File under `test/e2e/tests/accessibility/` with naming `Feature.accessibility.spec.ts`?
- `{ tag: '@accessibility' }` on each test?

**Component** (`.cursor/rules/testing/component-testing.mdc`):
- Tests only unique visual behaviour (animations, responsive, transitions)?
- Does not duplicate logic already covered in unit/integration?
- `data-testid` for element selection?
- Fast tests (< 1 second), independent?

**Unit** (`.cursor/rules/testing/unit-testing.mdc`):
- 100% logic coverage?
- No vitest global imports (`beforeEach`, `describe`, `expect`, `it`, `vi`)?
- `vi.hoisted()` for values used in `vi.mock()` factories?
- `vi.clearAllMocks()` in `beforeEach`?
- Spies for prop-passing and callbacks?
- No translation key assertions?

**Integration** (`.cursor/rules/testing/integration-testing.mdc`):
- Happy path + minimum data + API error covered?
- No step-level integration specs (top-level only)?
- `mockFetchResponse` instead of mocking `@shared/api-utils`?
- Only 3rd party mocked?

**Translation** (`.cursor/rules/testing/translation-testing.mdc`):
- One test per step/screen?
- `toHaveTranslations()` from `@shared/utils/test`?
- No namespace filters?
- No `translationCalls.length = 0` mid-test?

### Reviewer-a patterns (apply to all types)

Use the voice and patterns from `reviewer-a.md`:
- Challenge methods/fields/helpers without an obvious reason ("why do we need this?")
- Flag tests that could be parametrised
- Flag unnecessary manual `.waitFor()` calls
- Flag locators that are not `data-testid`
- Flag mixed responsibilities in step methods
- Flag error scenarios in E2E that should be in integration
- Flag missing back-navigation tests in multistep forms

---

## Phase 3 — Output

### 1. Chat summary (English)

- Files reviewed, layers detected
- Summary of issues: blockers vs suggestions
- Number of comments generated

### 2. Inline comments (GitLab format)

For each issue, generate a comment with:

```
File: <path>
Line: <new_line>
Comment: <English text, reviewer-a tone>
Blocking: yes | no
```

Group by file. Inline MR comments are always in English (reviewer-a writes in English).

### 3. Post to GitLab

**Never** post automatically. Wait until the user says "post the comments" / "publish the comments".

When posting: use `create_merge_request_discussion` with `position` (`base_sha`, `start_sha`, `head_sha`, `new_path`, `new_line`) for each inline comment. If the exact line is unavailable, post as a general comment without position.

---

## Checklist

```
MR: ____

- [ ] 0.   Ingest MR diff → detect test layers (caveman ON)
- [ ] 1.   Load rules for detected layers + reviewer-a profile
- [ ] 2.   Review per file: layer rules + reviewer-a patterns
- [ ] 3.   Output: English chat summary + English inline comments
- [ ]      Post to GitLab only if the user explicitly asks
```
