# Generate E2E Cypress Scenarios — Results Service (Latest Result Page)

Context
-	You are an expert QA automation engineer and Cypress test author. Your goal is to generate complete, maintainable, and deterministic E2E test scenarios (Cypress v10+ style) for the Lottoland Results Service — specifically the Latest Result Page which displays the latest draw/lottery result to end users.
-	Tests should be clear to implement, use best practices for selectors and assertions, and handle network stubbing for reliability. Focus on behavior, accessibility basics, and edge cases relevant to production.

Input (provide this JSON as the Input when running the prompt)
-	{
-	  "baseUrl": "https://results.lottoland.example",
-	  "route": "/latest",
-	  "apiEndpoint": "/api/results/latest",
-	  "sampleResponse": {
-	    "drawId": "2025-11-26-LOTTO",
-	    "date": "2025-11-26T20:00:00Z",
-	    "numbers": [5, 12, 23, 34, 45, 48],
-	    "bonus": 7,
-	    "jackpot": 5000000,
-	    "status": "published"
-	  },
-	  "selectors": {
-	    "resultContainer": "[data-cy=latest-result]",
-	    "date": "[data-cy=result-date]",
-	    "numbersList": "[data-cy=result-numbers]",
-	    "jackpot": "[data-cy=result-jackpot]",
-	    "statusBadge": "[data-cy=result-status]",
-	    "loadingSpinner": "[data-cy=loading-spinner]",
-	    "errorMessage": "[data-cy=error-message]"
-	  }
-	}

Rules
- Use explicit Cypress commands and best practices: `cy.intercept` for API stubbing, `cy.visit` with `onBeforeLoad` only if needed, and `data-cy` selectors for robust targeting.
- Provide tests that are deterministic: stub API responses (success, empty, error, slow network) and assert DOM behavior.
- Limit external dependencies: tests should be runnable in CI with network blocked for the API route and only the page served.
- Include test descriptions, setup steps (stubs/intercepts), and teardown notes where applicable.
- Use accessibility-aware assertions where meaningful (e.g., ensure the result container is focusable or has correct semantic tags).
- Split scenarios into: smoke (happy path), edge cases (no results, published vs pending), error handling, and performance/load-related checks (simulated slow response).
- Provide suggested file names and directory placement following common Cypress conventions (e.g., `cypress/e2e/results/latest.cy.ts`).
- Output Cypress test code using TypeScript with explicit types where simple and helpful; keep tests concise and readable.

Output format (exact)
- Return a Markdown document containing:
- 1) A short header describing the test file and placement.
- 2) A `---` separator line.
- 3) Complete Cypress test file content enclosed in a fenced code block labeled `typescript` and with the suggested filename in a preceding code fence comment (e.g., `// File: cypress/e2e/results/latest.cy.ts`).
- 4) A brief `Notes` section with guidance for running in CI and any environment variables required.

Ready-to-use prompt (for the LLM)
-Using the Input JSON above, generate the requested Markdown document adhering to the Output format. Do NOT include additional commentary beyond the Markdown document.

Example Input (real example — use when invoking this prompt now)
-
-{
-  "baseUrl": "https://results.lottoland.example",
-  "route": "/latest",
-  "apiEndpoint": "/api/results/latest",
-  "sampleResponse": {
-    "drawId": "2025-11-26-LOTTO",
-    "date": "2025-11-26T20:00:00Z",
-    "numbers": [5, 12, 23, 34, 45, 48],
-    "bonus": 7,
-    "jackpot": 5000000,
-    "status": "published"
-  },
-  "selectors": {
-    "resultContainer": "[data-cy=latest-result]",
-    "date": "[data-cy=result-date]",
-    "numbersList": "[data-cy=result-numbers]",
-    "jackpot": "[data-cy=result-jackpot]",
-    "statusBadge": "[data-cy=result-status]",
-    "loadingSpinner": "[data-cy=loading-spinner]",
-    "errorMessage": "[data-cy=error-message]"
-  }
-}

When you run the LLM with this prompt, the model should output a Markdown document containing the test file and notes as specified. Ensure returned code is complete, syntactically correct TypeScript for Cypress, and ready to paste into the suggested file path.
