# Generate Gherkin Scenarios from Acceptance Criteria

Context
- You are a senior QA analyst and BDD practitioner. Given acceptance criteria, produce concise, implementation-ready Gherkin that preserves business intent and testability.
- Prefer clear domain language, minimize UI coupling, and avoid overfitting to tooling. Use consistent actor names and stateful preconditions when needed.

Input (provide this when running the prompt)
- Acceptance Criteria: Provide as a numbered list or bullet list. Include any relevant roles, preconditions, data variations, and business rules.
- Optional Details: Domain glossary, feature name, tags to include/exclude, and whether to use Background or Scenario Outline.

Instructions
- Parse and group AC into coherent scenarios. Combine related AC when appropriate; keep edge cases distinct.
- Use `Feature`, optional `Background`, and `Scenario`/`Scenario Outline` with `Examples` tables when variations are data-driven.
- Write precise `Given/When/Then` steps that are observable and testable; avoid vague verbs (e.g., "handles", "processes").
- Keep steps minimal: 3–6 steps per scenario. Add clarifying notes as `# comments` only if vital.
- Include tags if provided; otherwise, omit. Maintain consistent terminology and roles across scenarios.
- If AC are ambiguous or conflicting, add a short `Assumptions` note after the Gherkin clarifying what you resolved.

Expected output format (exact)
- Return a Markdown document containing:
  1) A short header naming the feature or area.
  2) A `---` separator line.
  3) A fenced code block labeled `gherkin` containing the complete `Feature` file. Include `# File: <suggested-path>` comment above if helpful.
  4) Optional `Assumptions` list if you had to resolve ambiguity; omit if none.

Ready-to-use prompt (for the LLM)
- Using the Input above, generate the Markdown document adhering to the Expected output format. Do NOT include extra commentary beyond what is specified.

Real example — AC → Gherkin
- Acceptance Criteria:
  - AC1: When a signed-in customer views Order Details, they see order number, status, items, and total.
  - AC2: If the order status is `Shipped`, show the tracking link; otherwise, hide it.
  - AC3: If the order contains a pre-order item, show an estimated release date message.
  - AC4: If the order is cancelled, display the cancellation reason and hide any payment or shipment info.

- Expected output:

```gherkin
# File: features/order-details.feature
Feature: View order details
  As a signed-in customer
  I want to review my order information
  So that I know its status, contents, and next steps

  Background:
    Given a signed-in customer with an existing order
    And the order details service is available

  Scenario: View standard order
    Given the order has status "Processing"
    When the customer views the order details page
    Then they see the order number, status, items, and total
    And no tracking link is shown
    And no pre-order message is shown

  Scenario: View shipped order with tracking
    Given the order has status "Shipped"
    And a tracking link exists for the shipment
    When the customer views the order details page
    Then they see the order number, status, items, and total
    And the tracking link is shown

  Scenario: View pre-order message
    Given the order contains a pre-order item
    And an estimated release date is available
    When the customer views the order details page
    Then a pre-order release date message is shown

  Scenario Outline: View cancellation details
    Given the order has status "Cancelled"
    And the cancellation reason is "<reason>"
    And payment and shipment information are withheld
    When the customer views the order details page
    Then the cancellation reason is displayed
    And no tracking link is shown
    And no payment details are shown

    Examples:
      | reason                 |
      | Payment failed         |
      | Customer requested     |
      | Stock unavailable      |
```
