# Contributing Guidelines

Thank you for helping improve the prompt engineering playground. These conventions keep prompts organized and easy to use.

## Folder structure
- All prompts live under `prompt-engineering-playground/prompts`.
- Use existing subfolders for domain areas: `data`, `dev`, `general`, `qa`, etc. Do not create new top-level folders (e.g., avoid creating `../prompts` outside the repo).
- Keep examples and usage demos under `examples/` unless a prompt explicitly requires a colocated sample.

## Naming conventions
- File names: lower-kebab-case with `.md` extension (e.g., `pull-request-reviewer.md`).
- Titles in the document: start with a short, action-oriented heading (e.g., `Generate Gherkin Scenarios from Acceptance Criteria`).
- Be explicit about the target role (e.g., QA, data engineer, reviewer) and the input/output format.

## How to add a new prompt
1) Choose the correct folder under `prompts/` that matches the prompt’s domain (use `prompts/dev` for engineering tools, `prompts/qa` for testing, `prompts/data` for data tasks, etc.).
2) Create the Markdown file with:
   - **Context**: who the assistant is, goals, constraints.
   - **Input**: what the user supplies (with examples or schemas).
   - **Instructions**: how to process the input; important rules.
   - **Expected output format**: exact structure/sections.
   - **Ready-to-use prompt**: a concise directive for the LLM.
   - **Real example**: sample input and expected output (when helpful).
3) Keep instructions concise; prefer bullets; avoid tool-specific commands unless required.
4) Use ASCII; avoid introducing new Unicode unless the file already uses it.

## Quality checks before opening a PR
- Verify file placement: under `prompt-engineering-playground/prompts/<area>/` (not a new root folder).
- Spellcheck and clarity: ensure instructions are unambiguous and actionable.
- Validate examples: examples must align with the described input/output formats.
- Consistency: reuse existing section headings and tone from similar prompts in the same folder.
- Run Markdown linting if available in your environment (e.g., `markdownlint **/*.md`); if not available, manually check for obvious formatting issues (broken code fences, missing separators).
- Avoid accidental files: ensure no temporary files or extra directories are added.

## Submitting changes
- Keep commits focused on the prompt change. Mention the prompt path in the commit message.
- If adding multiple prompts, keep one prompt per commit when feasible.
