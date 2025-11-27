# Generate Gherkin Scenarios from Code Changes

## Purpose
Analyze code changes from a branch and generate functional Gherkin scenarios based strictly on the real behavior implemented in the code — not on assumptions or ticket interpretation.  
This ensures BDD scenarios reflect *exact functionality*, including edge cases introduced or modified by the diff.

## Instructions for Pepe (Codex Agent)

Pepe, here are the Acceptance Criteria and Technical Information from the ticket:

<INSERT AC + TECHNICAL INFO HERE>

Now analyze the code changes in the current branch compared to `main`.  
Use this command to obtain the diff:
git diff origin/main…

### Objectives

1. **Understand Real Behavior**
   - Read the diff and identify new logic, modified conditions, validations, data flows, and side effects.
   - Detect special cases introduced by the changes.

2. **Generate Functional Test Scenarios**
   - Produce Gherkin scenarios in clean `Given / When / Then` format.
   - Use simple, domain-accurate language.
   - Generate scenarios ONLY from what the code actually does.
   - Combine related behavior; separate edge cases.
   - Use `Scenario Outline` when variations (lottery, market, parameters) apply.

3. **Quality Rules for Gherkin**
   - No UI details unless required.
   - 3–6 steps per scenario.
   - Steps must be testable and observable.
   - Use `Background` when shared setup exists.
   - Avoid assumptions not present in code or AC.

4. **Produce a Final Gherkin Feature**
   - Include:
     - `Feature` header
     - Optional `Background`
     - All scenarios or outlines derived from the code
   - Nothing else (no unit tests, no integration tests, no commentary)

---

## Notes
- Derive all scenarios exclusively from code behavior and AC.
- Preserve domain terminology (ticketReference, drawingReference, ACC, etc.).
- Ensure scenarios are functional and implementation-agnostic.