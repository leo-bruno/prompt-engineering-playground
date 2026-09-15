# Reviewer: @reviewer-a

Derived from 85 comments across 14 MRs in the `example-fe` repo (2025–2026).

---

## What they prioritise

1. **Correct test scope per layer** — error cases belong in integration, not E2E. Full user journeys (happy path end-to-end) go in E2E; validation logic and API errors go in integration.
2. **Multistep form structure** — each step = its own object/class. Visually separate steps from validations. Follow the pattern in `Registration.integration.spec.tsx` and the validators under `test/e2e/interactions/validators/`.
3. **Robust locators** — `data-testid` always over text or `data-track-name` (those can change without being a test-breaking change).
4. **Concision** — if the implementation is verbose, they simplify it directly. No unnecessary defensiveness.
5. **Project conventions** — point to existing examples before inventing a new pattern.

---

## Frequent patterns (with real examples)

### 1. "Why do we need this?"
The most repeated question. If something has no obvious reason, they challenge it:
- `"why do we need this method and removal of consumer.seek?"`
- `"why do we need this field? registration worked fine without this field for me before"`
- `"why do we need to change this class? what was wrong with previous implementation?"`

**QA implication:** before adding a method, field, or helper, ensure the reason is documented or obvious.

### 2. Parametrised tests instead of duplicates
- `"1. no needs to wrap each test into describe 2. these tests can be joined and parametrised"`
- Tests with the same structure but different data → `test.each` / `it.each`.

### 3. `.not.toBeVisible()` over `.waitFor({ state: 'hidden' })`
- `"what is wrong with normal 'not.toBeVisible'? do we really need this specific .waitFor({ state: 'hidden' })?"`
- `"changed to await expect(item).not.toBeVisible(); should also work fine"`

### 4. No manual `.waitFor()` in Playwright
- `"please remove all .waitFor() - playwright is waiting with every click by default"`

### 5. Single responsibility in step methods
- `"for better readability let's not break single responsibility here"`
- `"we can call registerPlayer as usual and then call applyIdentityVerificationFailedTestState from the test class"`
- Do not mix player setup with assertions inside the same method.

### 6. Back-navigation coverage in multistep forms
- `"can we please add use-case validating that data is preserved when we are clicking back and then forward?"`
- Always references: `'should navigate back to Email and Password step with preserve data'` in `Registration.integration.spec.tsx`.

### 7. Error scenarios → integration, not E2E
- `"we usually don't add error cases to the e2e level. This normally should be tested on integration level. Any reason why we have this specific test on e2e level?"`
- `"can we cover also use-cases for errors from other apis that we are using in this flow?"` (in integration).

### 8. Translation tests without filters
- Removes filtering logic in translation specs (could silently skip keys).
- Removes mid-test state resets like `translationCalls.length = 0`.
- Wants full coverage of all translation keys without conditions.

### 9. Integration mocking: real service layer
- `"as it is an integration test, would be nice to work with real service layer if it is possible, mocking only BE side"`
- Prefer `mockFetchResponse` over mocking internal hooks.

### 10. File organisation by domain
- `"if this is a part of lottery domain - maybe we can put myactivity pact tests under /lotteries/ folder?"`
- `"I would avoid 'core' as they were thinking to split into 'player' and 'accounting' domains"`
- Before creating a file, confirm the domain and folder are correct.

### 11. Tests in the `lottoland/uk` app, not only in `shared/`
- `"I have noticed that we are ignoring completely testing on lottoland/uk app. Can we start adding some tests to uk app too?"`
- Unit tests for app-specific logic belong in `apps/lottoland/uk`, not only in `shared/`.

### 12. Full AC coverage, including forgotten edge cases
- `"Don't we need to test also account name validation according to new regex?"`
- If there is an AC for an error or special state, they expect a specific test.

---

## How they express feedback

- **Tone:** direct, often as a question. Rarely orders — almost always asks for the reason.
- **Length:** short comments (1–2 sentences). When longer, it is because they explain with a code example or point to a reference file.
- **Characteristic phrases:**
  - `"why do we need...?"`
  - `"any reason why...?"`
  - `"let's keep / let's not mix / let's follow"`
  - `"please see example in <path>"`
  - `"as we have all over this project"`
  - `"I think we can remove this"` / `"this is not e2e test. refactored"`
- **When they fix directly:** one sentence on what they did: `"simplified"`, `"reverted"`, `"fixed"`, `"removed. not related to the test"`.
- **No praise** — they approve directly or leave an inline correction.

---

## Review checklist (anticipate their comments)

Before opening an MR, verify:

- [ ] Are error cases in integration tests, not E2E?
- [ ] Do multistep form tests follow the `Registration.integration.spec.tsx` pattern (step = class)?
- [ ] Do locators use `data-testid`? No text or `data-track-name` locators?
- [ ] Are unnecessary manual `.waitFor()` calls avoided in Playwright?
- [ ] Are similar tests parametrised with `test.each`?
- [ ] Is there a back-navigation test with preserved data when the form has a previous step?
- [ ] Does integration use the real service layer (BE mocked only)?
- [ ] Do translation tests cover all keys without namespace filters?
- [ ] Are files in the correct domain folder?
- [ ] Are there tests in `apps/lottoland/uk` for app-specific logic?
- [ ] Do all step methods have single responsibility?
- [ ] Does every method/field/helper have an obvious reason to exist?
