# Prompt Engineering Playground

Purpose
-	This repository stores, organizes and documents high-quality AI prompts used by a QA Engineer and developer for testing, automation, and developer workflows. It aims to be a curated, searchable library of actionable prompts for generating tests, troubleshooting steps, data transformations, and development aids.

Repository structure
-	`prompts/` — Primary collection of prompts, grouped by purpose:
-		`prompts/qa/` — Prompts oriented to Quality Assurance, test generation, test strategy, E2E scenarios, exploratory test plans, and test data creation.
-		`prompts/dev/` — Prompts aimed at developer tasks: refactoring guidance, code-generation snippets, API design, and CI/CD automation.
-		`prompts/data/` — Prompts for data work: data validation, transformation descriptions, synthetic data generation, and data quality checks.
-		`prompts/general/` — Reusable general-purpose prompts: writing guides, meeting notes, summaries, and templates.

-	`examples/` — Concrete examples where prompts are used to generate outputs and artifacts.
-		`examples/results-service/` — Example outputs and artifacts for the Results Service (Latest Result Page) generated using the prompts.

How to use this repository
-	Add or edit prompts in the appropriate subfolder under `prompts/` using clear names and headers. Each prompt file should follow a consistent layout with Context, Input, Rules, and Output format sections.
-	When running prompts against an LLM, copy the full contents of a `.md` prompt file and provide the `Input` block values as structured JSON or as the LLM client requires.
-	Store example outputs in `examples/` to keep an auditable trail of generated artifacts and to help iterate on prompt improvements.
-	Use the repository as a single source of truth for repeatable prompt-driven tasks in testing and development workflows. Consider pinning model versions and temperature settings externally in your prompt runner.

Planned prompts (short roadmap)
-	Expand QA prompts for: test-case prioritization, flaky test detection, flaky test triage checklists, visual regression scenarios, performance test harness generation.
-	Add developer prompts for: API contract generation, OpenAPI -> mock server generation, unit-test scaffolding for legacy modules.
-	Add data prompts for: schema migration plans, anonymization scripts, and synthetic dataset specification templates.

License
-	MIT License
-
-	Copyright (c) 2025
-
-	Permission is hereby granted, free of charge, to any person obtaining a copy
-	of this software and associated documentation files (the "Software"), to deal
-	in the Software without restriction, including without limitation the rights
-	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
-	copies of the Software, and to permit persons to whom the Software is
-	furnished to do so, subject to the following conditions:
-
-	The above copyright notice and this permission notice shall be included in all
-	copies or substantial portions of the Software.
-
-	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
-	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
-	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
-	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
-	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
-	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
-	SOFTWARE.
